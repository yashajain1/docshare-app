Architecture note

Priority choices

- Tech stack: Node.js + Express + SQLite. SQLite keeps persistence lightweight and easy to run locally without external services.
- Editor: Quill via CDN for a quick, polished editing surface supporting bold/italic/underline/headings and lists.
- Auth: lightweight, cookie-based mocked auth using seeded users (`alice`, `bob`) to keep focus on sharing and flows rather than auth complexity.
- Sharing: owner can add entries to a shares table. Shared users can open and edit documents.

What I prioritized

1. End-to-end flows: create, edit, save, reopen, upload file -> new doc, share, and view shared docs.
2. Minimal reliable persistence and simple API with clear boundaries.
3. UX that feels coherent (clear owned vs shared docs, save/rename/share actions).

What I cut to fit the timebox

- No production auth (OAuth, email) — replaced by quick seeded users and a login endpoint.
- No complex permissions or version history.
- No deployment automation included in the repo (you can run npm start locally).

