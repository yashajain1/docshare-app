# Architecture Note

This project (DocShare) is intentionally small and designed to demonstrate full-stack choices, tradeoffs, and priorities under a tight timebox.

Key decisions and priorities

- Backend: FastAPI + SQLModel + SQLite
  - FastAPI provides rapid API development, type hints, and automatic OpenAPI docs for quick iteration and testing.
  - SQLModel (SQLAlchemy + Pydantic) simplifies models and validation; SQLite keeps setup friction low for reviewers.
  - Sanitization: bleach is used server-side to clean HTML saved from the editor to reduce XSS risk.

- Frontend: React (Vite) + react-quill
  - React with Vite offers fast dev feedback and easy bundling for deployment.
  - react-quill provides a small, usable rich-text editor with bold/italic/underline/headings and lists out-of-the-box.

- Sharing model
  - Documents have an owner and a SharedDocument join table to grant other users access.
  - Access checks are applied server-side on fetch and update endpoints.

- Persistence and format
  - Rich text is stored as sanitized HTML (content_html). This choice reduces complexity vs storing editor deltas but preserves formatting for the main flows.

What I prioritized (timebox-driven)
- Core flows that show product intent: create/edit/save documents, import from .md/.txt, and simple sharing with seeded users.
- Correct, minimal server-side validation and data model with an integration test covering create/share/fetch.

What I intentionally deferred
- Storing Quill delta format and rich operational transforms (OT) for collaboration.
- Production-grade auth and user management (mock X-User-Id header is used for demo).
- File storage on S3 or using Postgres; SQLite and server disk uploads are used for simplicity.

How to run locally
- See server/README.md and client/README.md for step-by-step instructions.
