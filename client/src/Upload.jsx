import React, { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000'

export default function Upload({user, onUploaded}){
  const [file, setFile] = useState(null)
  const [createNew, setCreateNew] = useState(true)

  const submit = async ()=>{
    if(!file){ alert('Select a file'); return }
    const fd = new FormData()
    fd.append('file', file)
    fd.append('create_doc', createNew)
    try{
      const headers = {'X-User-Id': user.id}
      const r = await axios.post(API + '/upload', fd, {headers})
      alert('Uploaded')
      onUploaded && onUploaded()
    }catch(e){
      console.error(e)
      alert('Upload failed: ' + (e?.response?.data?.detail || e.message))
    }
  }

  return (
    <div style={{border:'1px dashed #ccc', padding:10}}>
      <div>Import (.md, .txt only)</div>
      <input type="file" accept=".md,.txt" onChange={e=>setFile(e.target.files[0])} />
      <div style={{marginTop:8}}>
        <label><input type="checkbox" checked={createNew} onChange={e=>setCreateNew(e.target.checked)} /> Create new document</label>
      </div>
      <div style={{marginTop:8}}>
        <button onClick={submit}>Upload</button>
      </div>
    </div>
  )
}
