import pytest
from fastapi.testclient import TestClient
from .main import app
from .seed import run_seed


@pytest.fixture(scope="module")
def client():
    # ensure seed
    run_seed()
    with TestClient(app) as c:
        yield c


def test_create_and_share_flow(client):
    # list users
    r = client.get('/users')
    assert r.status_code == 200
    users = r.json()
    assert len(users) >= 2
    alice = users[0]
    bob = users[1]

    # Alice creates a doc
    headers = {"X-User-Id": str(alice['id'])}
    payload = {"title": "Test Doc", "content_html": "<p>hi <strong>there</strong></p>"}
    r = client.post('/documents', json=payload, headers=headers)
    assert r.status_code == 200
    doc = r.json()
    doc_id = doc['id']

    # Alice shares with Bob
    r = client.post(f'/documents/{doc_id}/share', json={"user_id": bob['id']}, headers=headers)
    assert r.status_code == 200

    # Bob can fetch
    headers_bob = {"X-User-Id": str(bob['id'])}
    r = client.get(f'/documents/{doc_id}', headers=headers_bob)
    assert r.status_code == 200
    fetched = r.json()
    assert fetched['title'] == 'Test Doc'
