const quill = new Quill('#editor', { theme: 'snow' });
let currentDoc = null;

async function api(path, opts={}){
  if (!opts.headers) opts.headers = {};
  if (opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)){
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch('/api'+path, opts);
  if (res.status === 401) {
    alert('Please login first');
    return null;
  }
  return res.json();
}

async function loadMe(){
  const r = await api('/me');
  document.getElementById('me').innerText = r.user ? 'Logged in as ' + r.user : 'Not logged in';
}

async function loadDocs(){
  const rows = await api('/docs');
  const container = document.getElementById('docs');
  container.innerHTML='';
  if (!rows) return;
  rows.forEach(d => {
    const el = document.createElement('div');
    el.className='doc-item';
    el.innerHTML = `<strong>${d.title}</strong><div class="meta">${d.owner} ${d.owned?'(owned)':'(shared)'}</div>`;
    el.addEventListener('click', ()=> openDoc(d.id));
    container.appendChild(el);
  });
}

async function openDoc(id){
  const d = await api('/docs/' + id);
  if (!d) return;
  currentDoc = d;
  quill.root.innerHTML = d.content || '';
}

document.getElementById('login').addEventListener('click', async ()=>{
  const u = document.getElementById('username').value.trim();
  if (!u) return alert('enter username');
  const res = await api('/login', { method:'POST', body:{ username: u } });
  if (res && res.ok) {
    await loadMe();
    await loadDocs();
  } else {
    alert(JSON.stringify(res));
  }
});

document.getElementById('newDoc').addEventListener('click', async ()=>{
  const title = document.getElementById('newTitle').value || 'Untitled';
  const res = await api('/docs', { method:'POST', body:{ title, content: '' } });
  if (res && res.id) {
    await loadDocs();
    openDoc(res.id);
  }
});

document.getElementById('saveBtn').addEventListener('click', async ()=>{
  if (!currentDoc) return alert('Open a doc first');
  const content = quill.root.innerHTML;
  const res = await api('/docs/' + currentDoc.id, { method:'PUT', body: { title: currentDoc.title, content } });
  if (res && res.id) {
    alert('Saved');
    await loadDocs();
  }
});

document.getElementById('renameBtn').addEventListener('click', async ()=>{
  if (!currentDoc) return alert('Open a doc first');
  const t = document.getElementById('renameInput').value.trim();
  if (!t) return alert('enter title');
  const res = await api('/docs/' + currentDoc.id, { method:'PUT', body: { title: t, content: quill.root.innerHTML } });
  if (res && res.id) { currentDoc = res; await loadDocs(); alert('Renamed'); }
});

document.getElementById('shareBtn').addEventListener('click', async ()=>{
  if (!currentDoc) return alert('Open a doc first');
  const u = document.getElementById('shareUser').value.trim();
  if (!u) return alert('enter username');
  const res = await api('/docs/' + currentDoc.id + '/share', { method:'POST', body: { username: u } });
  if (res && res.ok) { alert('Shared'); await loadDocs(); }
  else alert(JSON.stringify(res));
});

document.getElementById('uploadBtn').addEventListener('click', async ()=>{
  const input = document.getElementById('fileInput');
  if (!input.files.length) return alert('select a file');
  const form = new FormData();
  form.append('file', input.files[0]);
  const res = await fetch('/api/upload', { method:'POST', body: form });
  const data = await res.json();
  if (data && data.id) { await loadDocs(); openDoc(data.id); }
  else alert(JSON.stringify(data));
});

// initial
loadMe();
loadDocs();
