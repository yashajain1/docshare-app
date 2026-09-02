Deploying the DocShare frontend to Vercel

Prerequisites
- A Vercel account (https://vercel.com)
- The repository connected to Vercel via GitHub

Quick steps (Vercel)
1. Go to https://vercel.com/new and import a project from GitHub.
2. Select the repo: yashajain1/docshare-app and the branch feature/fastapi-react.
3. In the Import settings set:
   - Root Directory: client
   - Build Command: npm install && npm run build
   - Output Directory: dist
4. Click Deploy.

After deploy finishes you will have a frontend URL like: https://docshare-frontend.vercel.app

CORS
- If your backend has a public URL, update server/src/main.py CORSMiddleware allow_origins to include the Vercel frontend origin (or use '*' for demo).

Notes
- Alternatively you can use Render Static Site hosting (render.yaml contains an example staticSites entry) if you prefer keeping both services on Render.
