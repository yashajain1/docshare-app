Deploying the DocShare backend to Render

Prerequisites
- A Render account (https://render.com)
- Your GitHub repo (this repository) connected to Render via OAuth

Quick steps (Render web service)
1. Go to https://dashboard.render.com/new and choose "Web Service".
2. Connect your GitHub repo and select the repo: yashajain1/docshare-app
3. For the branch, select: feature/fastapi-react
4. Configure the service:
   - Name: docshare-backend
   - Environment: Python
   - Build Command: pip install -r server/requirements.txt
   - Start Command: uvicorn server.src.main:app --host 0.0.0.0 --port 8000
   - Instance Type: Free or Starter
   - Disk: ensure at least 1 GB if you plan to keep uploads
5. Add Environment Variables (optional):
   - If you want to restrict CORS, set FRONTEND_URL to your frontend URL and update server/src/main.py CORS accordingly (see note below).
6. Create the service and wait for the deploy to finish.

Notes on SQLite & uploads
- Render provides ephemeral instances for some plans; to persist uploads and the SQLite DB across deploys, choose a service plan that provides persistent disk, or switch to an external DB (Postgres) and external file store (S3) for production.

CORS
- The server currently allows http://localhost:5173. After you deploy the frontend, update server/src/main.py to include the production frontend origin in the CORSMiddleware allow_origins list (or set to ["*"] for a quick demo).

Once deployed, you will have a backend URL like: https://docshare-backend.onrender.com
Place that URL into client code (or configure the frontend to call it via environment variable).
