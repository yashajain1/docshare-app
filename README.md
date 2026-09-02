# DocShare App

This repo contains a minimal full-stack document editor built for the assignment. It includes:

- Basic rich-text editing (Quill)
- Document create / rename / edit / save
- File upload of .txt and .md to create documents
- Simple sharing model (owner + shares)
- Persistence with SQLite (data.sqlite created on startup)
- Seeded users: `alice`, `bob`

Quick start

1. Install

   npm install

2. Start server

   npm start

3. Open http://localhost:3000 in your browser

Login with username `alice` or `bob` (no password). Use the UI to create/edit documents, upload .txt/.md files, and share docs from the owner account.

Notes and constraints

- This is intentionally small to fit the timebox. It demonstrates the main flows required by the assignment.
- Upload supports only .txt and .md for simplicity — other file types will be rejected.
- Sharing: only the document owner can grant access to another seeded user.

Testing

Run the basic API test:

   npm test

Files added

- server.js (Express + SQLite backend)
- public/ (frontend: index.html, app.js)
- package.json
- README.md
- ARCHITECTURE.md
- AI_NOTE.md
- SUBMISSION.md
- WALKTHROUGH_VIDEO.txt
- test/test_api.js

