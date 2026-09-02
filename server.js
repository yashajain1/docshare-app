const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const DB_FILE = path.join(__dirname, 'data.sqlite');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const db = new sqlite3.Database(DB_FILE);

function initDb() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS docs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      owner TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS shares (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      doc_id INTEGER NOT NULL,
      username TEXT NOT NULL,
      UNIQUE(doc_id, username)
    )`);

    // Seed users
    db.run(`INSERT OR IGNORE INTO users (username) VALUES ('alice'), ('bob')`);

    // Seed sample doc
    db.get(`SELECT COUNT(1) as c FROM docs`, (err, row) => {
      if (!err && row.c === 0) {
        db.run(`INSERT INTO docs (title, content, owner) VALUES (?, ?, ?)`, [
          'Welcome',
          '<h2>Welcome to DocShare</h2><p>Edit this document or create a new one.</p>',
          'alice'
        ]);
      }
    });
  });
}

initDb();

const app = express();
app.use(cors());
app.use(express.json({limit: '5mb'}));
app.use(cookieParser());
app.use(express.static('public'));

// Simple auth: set username in cookie via /api/login
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });
  db.get('SELECT username FROM users WHERE username = ?', [username], (err, row) => {
    if (err) return res.status(500).json({ error: 'db' });
    if (!row) return res.status(404).json({ error: 'user not found' });
    res.cookie('user', username, { httpOnly: false });
    res.json({ ok: true, username });
  });
});

app.get('/api/me', (req, res) => {
  const user = req.cookies.user || null;
  res.json({ user });
});

function requireUser(req, res, next) {
  const user = req.cookies.user;
  if (!user) return res.status(401).json({ error: 'not authenticated' });
  req.user = user;
  next();
}

app.get('/api/docs', requireUser, (req, res) => {
  const user = req.user;
  const sql = `SELECT d.*, 
    CASE WHEN d.owner = ? THEN 1 ELSE 0 END as owned
    FROM docs d
    LEFT JOIN shares s ON s.doc_id = d.id
    WHERE d.owner = ? OR s.username = ?
    GROUP BY d.id
    ORDER BY d.created_at DESC`;
  db.all(sql, [user, user, user], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db' });
    res.json(rows);
  });
});

app.post('/api/docs', requireUser, (req, res) => {
  const { title = 'Untitled', content = '' } = req.body;
  db.run('INSERT INTO docs (title, content, owner) VALUES (?, ?, ?)', [title, content, req.user], function(err) {
    if (err) return res.status(500).json({ error: 'db' });
    const id = this.lastID;
    db.get('SELECT * FROM docs WHERE id = ?', [id], (e, row) => res.json(row));
  });
});

app.get('/api/docs/:id', requireUser, (req, res) => {
  const id = req.params.id;
  const user = req.user;
  const sql = `SELECT d.* FROM docs d
    LEFT JOIN shares s ON s.doc_id = d.id
    WHERE d.id = ? AND (d.owner = ? OR s.username = ?)`;
  db.get(sql, [id, user, user], (err, row) => {
    if (err) return res.status(500).json({ error: 'db' });
    if (!row) return res.status(404).json({ error: 'not found or no access' });
    res.json(row);
  });
});

app.put('/api/docs/:id', requireUser, (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;
  // allow update if owner or shared
  const user = req.user;
  const check = `SELECT d.* FROM docs d LEFT JOIN shares s ON s.doc_id = d.id WHERE d.id = ? AND (d.owner = ? OR s.username = ?)`;
  db.get(check, [id, user, user], (err, row) => {
    if (err) return res.status(500).json({ error: 'db' });
    if (!row) return res.status(404).json({ error: 'not found or no access' });
    db.run('UPDATE docs SET title = ?, content = ? WHERE id = ?', [title || row.title, content || row.content, id], function(e) {
      if (e) return res.status(500).json({ error: 'db' });
      db.get('SELECT * FROM docs WHERE id = ?', [id], (ee, updated) => res.json(updated));
    });
  });
});

app.post('/api/docs/:id/share', requireUser, (req, res) => {
  const id = req.params.id;
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });
  // only owner can share
  db.get('SELECT * FROM docs WHERE id = ?', [id], (err, doc) => {
    if (err) return res.status(500).json({ error: 'db' });
    if (!doc) return res.status(404).json({ error: 'doc not found' });
    if (doc.owner !== req.user) return res.status(403).json({ error: 'only owner can share' });
    db.get('SELECT username FROM users WHERE username = ?', [username], (e, userRow) => {
      if (e) return res.status(500).json({ error: 'db' });
      if (!userRow) return res.status(404).json({ error: 'user not found' });
      db.run('INSERT OR IGNORE INTO shares (doc_id, username) VALUES (?, ?)', [id, username], function(err2) {
        if (err2) return res.status(500).json({ error: 'db' });
        res.json({ ok: true });
      });
    });
  });
});

const upload = multer({ dest: UPLOAD_DIR });
app.post('/api/upload', requireUser, upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'no file' });
  const allowed = ['.txt', '.md'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) return res.status(400).json({ error: 'only .txt and .md supported' });
  const content = fs.readFileSync(file.path, 'utf8');
  const html = '<pre>' + escapeHtml(content) + '</pre>';
  db.run('INSERT INTO docs (title, content, owner) VALUES (?, ?, ?)', [file.originalname, html, req.user], function(err) {
    if (err) return res.status(500).json({ error: 'db' });
    const id = this.lastID;
    db.get('SELECT * FROM docs WHERE id = ?', [id], (e, row) => res.json(row));
  });
});

function escapeHtml(text) {
  return text.replace(/[&<>\"]/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c];
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));

module.exports = app; // for tests
