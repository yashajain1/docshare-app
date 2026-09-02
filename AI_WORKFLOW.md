# AI Workflow Note

I used AI assistance to accelerate scaffolding, iterate on API routes, and draft documentation. Below is a concise record of how AI was used and how outputs were validated.

Tools used
- ChatGPT (code assistant) for scaffolding FastAPI routes, Prisma/SQLModel model ideas, example React components, and README/architecture text.

Where AI materially sped up work
- Generated basic FastAPI route patterns and SQLModel schemas that I edited to match the data model.
- Drafted React component structure (App, Editor, Upload, ShareModal) and example axios calls.
- Produced initial README and CI workflow YAML which I then adapted.

What I changed or rejected from AI output
- I audited and simplified AI-suggested security choices — enforced server-side HTML sanitization (bleach), and adjusted access checks to be explicit.
- Revised AI-proposed UI code to fix state handling and to integrate the editor save/open flows.

Verification
- Ran the backend locally and executed the pytest integration test to verify create/share/fetch behavior.
- Manually tested the editor flow locally (create document, save, seed users) and validated upload/import endpoints using curl where applicable.

Notes on responsible usage
- AI was used as an accelerant — all generated code was reviewed and edited by me for correctness, security, and style.
