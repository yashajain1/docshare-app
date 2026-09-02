# Server README

Quickstart (recommended using virtualenv):

python -m venv .venv
source .venv/bin/activate
pip install -r server/requirements.txt

# Seed DB
python -c "from server.src.seed import run_seed; run_seed()"

# Run server
uvicorn server.src.main:app --reload --port 8000

This starts the FastAPI backend at http://localhost:8000

Notes:
- Mock auth: include header X-User-Id with the numeric user id (see seeded users Alice, Bob, Carol)
- Uploads: POST /upload accepts .md and .txt and will create a new document by default

Tests:

pip install -r server/requirements.txt
pytest -q
