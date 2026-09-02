import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'

const API = 'http://localhost:8000'

export default function Editor({user, onSaved}){
  const [title, setTitle] = useState('New Document')
  const [content, setContent] = useState('<p>Start writing...</p>')

  const save = async ()=>{
    await axios.post(API + '/documents', {title, content_html: content}, {headers: {'X-User-Id': user.id}})
    onSaved && onSaved()
    alert('Saved')
  }

  return (
    <div style={{marginTop:20}}>
      <input value={title} onChange={e=>setTitle(e.target.value)} />
      <div style={{height:300}}>
        <ReactQuill theme="snow" value={content} onChange={setContent} />
      </div>
      <button onClick={save}>Save</button>
    </div>
  )
}
