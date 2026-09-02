from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str

    documents: list["Document"] = Relationship(back_populates="owner")

class Document(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content_html: str
    owner_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    owner: Optional[User] = Relationship(back_populates="documents")
    shared_with: list["SharedDocument"] = Relationship(back_populates="document")

class SharedDocument(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    document_id: int = Field(foreign_key="document.id")
    user_id: int = Field(foreign_key="user.id")
    role: str = Field(default="reader")

    document: Optional[Document] = Relationship(back_populates="shared_with")
