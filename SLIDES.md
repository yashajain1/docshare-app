# Slide Deck — DocShare Walkthrough

Slide 1 — Title

Title: DocShare — Lightweight Collaborative Editor
Subtitle: Create • Edit • Upload • Share
Speaker notes: Hi — I’m [Your Name]. In this 3–5 minute walkthrough I’ll demo the main flows for DocShare: creating and editing documents, importing files, and sharing with teammates.

---

Slide 2 — Goals & Scope

Bullets:
- Goal: ship a focused collaborative editor slice in a short timebox
- Scope: create/edit/save, .txt/.md upload, simple sharing, SQLite persistence
- Out of scope: production auth, version history, real-time concurrency

Speaker notes: Explain why we cut scope and what we prioritized: end-to-end flows and persistence.

---

Slide 3 — Tech & Seeded Users

Bullets:
- Backend: Node.js + Express
- Persistence: SQLite (data.sqlite)
- Editor: Quill (CDN)
- Uploads: multer
- Seeded users: alice, bob (login in UI with username only)

Speaker notes: Briefly note tradeoffs (no password auth to keep scope realistic).

---

Slide 4 — Key Features (Live Demo)

Bullets:
- Create a new document
- Rich-text editing: bold, italic, underline, headings, lists
- Rename and Save
- Upload .txt/.md to create docs
- Share from owner -> other user

Speaker notes: Transition into live demo; mention where to find the repo and credentials.

---

Slide 5 — Data Model & API (snippet)

Show these tables:
- users(id, username)
- docs(id, title, content, owner, created_at)
- shares(id, doc_id, username)

Speaker notes: Explain access: queries only return docs where owner = current user OR shares.username = current user.

---

Slide 6 — Demo Flow (step checklist)

1. Start server: `npm install && npm start`
2. Open http://localhost:3000
3. Login as alice
4. Create + format + save document
5. Upload sample.md -> new doc
6. Share doc to bob; switch to bob and open shared doc

Speaker notes: These are the actions you’ll record in the live demo segment.

---

Slide 7 — Tradeoffs & Next Steps

Bullets:
- Cut: real auth, version history, CI/CD, nicer UI
- Next: add password auth, deployment (Render/Vercel), more tests, versioning

Speaker notes: Emphasize product judgment and scope choices.

---

Slide 8 — AI Workflow Note

Bullets:
- AI used to scaffold boilerplate and drafts for docs/tests
- Human review: simplified generated code, removed advanced patterns
- Verification: ran tests and manual flows locally

Speaker notes: Keep this short — reflect the AI_NOTE.md in the repo.

---

Slide 9 — Links & How to Run

Bullets:
- Repo: https://github.com/yashajain1/docshare-app
- Run: `npm install && npm start` then open `http://localhost:3000`
- Seeded users: alice, bob

Speaker notes: Invite viewers to try locally and check ARCHITECTURE.md and AI_NOTE.md.
