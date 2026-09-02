from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import Optional
import os
import aiofiles

from .db import engine, get_session, DATABASE_URL
from .models import SQLModel, User, Document, SharedDocument
from .sanitizer import sanitize_html

app = FastAPI(title="DocShare API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


# Simple mock auth: client sends X-User-Id header with user id
def get_current_user(x_user_id: Optional[str] = Header(None), session: Session = Depends(get_session)) -> User:
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing X-User-Id header for mock auth")
    user = session.get(User, int(x_user_id))
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user id")
    return user


@app.post("/auth/login")
def login(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "name": user.name, "email": user.email}


@app.get("/users")
def list_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users


@app.post("/documents")
def create_document(payload: dict, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    title = payload.get("title") or "Untitled"
    raw = payload.get("content_html", "")
    safe = sanitize_html(raw)
    doc = Document(title=title, content_html=safe, owner_id=current_user.id)
    session.add(doc)
    session.commit()
    session.refresh(doc)
    return doc


@app.get("/documents")
def list_documents(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # owned
    owned = session.exec(select(Document).where(Document.owner_id == current_user.id)).all()
    # shared
    rows = session.exec(select(SharedDocument).where(SharedDocument.user_id == current_user.id)).all()
    shared_docs = []
    for r in rows:
        d = session.get(Document, r.document_id)
        if d:
            shared_docs.append(d)
    return {"owned": owned, "shared": shared_docs}


@app.get("/documents/{doc_id}")
def get_document(doc_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    doc = session.get(Document, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.owner_id != current_user.id:
        shared = session.exec(select(SharedDocument).where((SharedDocument.document_id == doc_id) & (SharedDocument.user_id == current_user.id))).first()
        if not shared:
            raise HTTPException(status_code=403, detail="Access denied")
    return doc


@app.patch("/documents/{doc_id}")
def update_document(doc_id: int, payload: dict, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    doc = session.get(Document, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    # allow owner or shared to edit (simple)
    if doc.owner_id != current_user.id:
        shared = session.exec(select(SharedDocument).where((SharedDocument.document_id == doc_id) & (SharedDocument.user_id == current_user.id))).first()
        if not shared:
            raise HTTPException(status_code=403, detail="Access denied")
    title = payload.get("title")
    raw = payload.get("content_html")
    if title:
        doc.title = title
    if raw is not None:
        doc.content_html = sanitize_html(raw)
    from datetime import datetime
    doc.updated_at = datetime.utcnow()
    session.add(doc)
    session.commit()
    session.refresh(doc)
    return doc


@app.post("/documents/{doc_id}/share")
def share_document(doc_id: int, payload: dict, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # payload: {"user_id": int, "role": "reader"}
    doc = session.get(Document, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    if doc.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only owner can share")
    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(status_code=400, detail="user_id required")
    user = session.get(User, int(user_id))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    existing = session.exec(select(SharedDocument).where((SharedDocument.document_id == doc_id) & (SharedDocument.user_id == user_id))).first()
    if existing:
        return {"detail": "Already shared"}
    sd = SharedDocument(document_id=doc_id, user_id=user_id, role=payload.get("role", "reader"))
    session.add(sd)
    session.commit()
    session.refresh(sd)
    return sd


@app.post("/upload")
async def upload(file: UploadFile = File(...), create_doc: Optional[bool] = True, doc_id: Optional[int] = None, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    # accept .md and .txt only
    filename = file.filename
    ext = filename.split('.')[-1].lower()
    if ext not in ("md", "txt"):
        raise HTTPException(status_code=400, detail="Only .md and .txt files are supported")
    save_path = os.path.join(UPLOAD_DIR, filename)
    content = await file.read()
    if len(content) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large")
    async with aiofiles.open(save_path, 'wb') as f:
        await f.write(content)
    text = content.decode('utf-8')
    if create_doc and (not doc_id):
        title = os.path.splitext(filename)[0]
        doc = Document(title=title, content_html=sanitize_html(text.replace('\n','<br/>')), owner_id=current_user.id)
        session.add(doc)
        session.commit()
        session.refresh(doc)
        return {"uploaded": True, "document": doc}
    elif doc_id:
        doc = session.get(Document, doc_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        # append
        doc.content_html = (doc.content_html or '') + '<br/>' + sanitize_html(text.replace('\n','<br/>'))
        session.add(doc)
        session.commit()
        session.refresh(doc)
        return {"uploaded": True, "document": doc}
    return {"uploaded": True}
