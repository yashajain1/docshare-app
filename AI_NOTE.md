AI Workflow Note

Which AI tools I used

- I used this AI assistant to help plan the scaffold, write API and frontend code snippets, and draft README and architecture notes.

Where AI materially sped up work

- Generating endpoint skeletons and typical CRUD patterns for Express + SQLite.
- Drafting README, architecture, and test boilerplate.

What AI output I changed or rejected

- I reviewed and edited all AI-generated code to ensure it fits a small, runnable project. I removed overly complex patterns (ORMs, advanced auth) and simplified to direct SQL for clarity.

How I verified correctness and UX quality

- I included a basic automated test (see test/test_api.js) and manually exercised the app locally: login, create doc, save, rename, upload, share, and open as shared user.

