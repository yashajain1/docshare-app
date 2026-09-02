"""Seed database with demo users and docs"""
from .db import engine
from .models import SQLModel, User, Document, SharedDocument


def run_seed():
    SQLModel.metadata.create_all(engine)
    from sqlmodel import Session
    with Session(engine) as session:
        # create users
        alice = User(name="Alice", email="alice@example.com")
        bob = User(name="Bob", email="bob@example.com")
        carol = User(name="Carol", email="carol@example.com")
        session.add(alice)
        session.add(bob)
        session.add(carol)
        session.commit()
        session.refresh(alice)
        session.refresh(bob)
        # sample document
        doc = Document(title="Sample Doc", content_html="<h1>Hello</h1><p>This is a sample document.</p>", owner_id=alice.id)
        session.add(doc)
        session.commit()
        session.refresh(doc)
        # share to bob
        sd = SharedDocument(document_id=doc.id, user_id=bob.id, role="reader")
        session.add(sd)
        session.commit()
        print("Seeded: users and sample doc")

if __name__ == '__main__':
    run_seed()
