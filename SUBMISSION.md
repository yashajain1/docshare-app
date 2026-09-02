# SUBMISSION

This submission contains the repository and artifacts for the DocShare assignment.

Included files and notes:
- Full source code in this repository under server/ and client/
- server/ includes FastAPI backend, models, sanitizer, seed script, and tests
- client/ includes a minimal React + Vite frontend with editor, upload, and share modal
- ARCHITECTURE.md — short architecture note
- AI_WORKFLOW.md — AI usage note
- WALKTHROUGH.txt — link to walkthrough video (add link)

What works
- Create new documents with rich-text formatting (editor + save)
- Upload .md/.txt to create documents via /upload endpoint
- Share documents (owner can share with seeded users); access checks enforced server-side
- Documents and sharing persist in SQLite; seeded users show demo flow
- One integration test covering create → share → fetch

What is incomplete / next steps
- Frontend UX polishing (e.g., owner names in shared list, better error UI)
- Live deployment not included — add Render/Vercel deployment
- Additional tests and E2E coverage

To run locally: see server/README.md and client/README.md
