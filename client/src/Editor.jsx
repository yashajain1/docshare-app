import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'

const API = 'http://localhost:8000'

export default function Editor({user, doc, onSaved}){
  const [title, setTitle] = useState('New Document')
  const [content, setContent] = useState('<p>Start writing...</p>')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(()=>{
    if(doc){
      setTitle(doc.title || 'Untitled')
      setContent(doc.content_html || '')
    }
  },[doc])

  const save = async ()=>{
    if(!user){ alert('Please sign in to save'); return }
    setIsSaving(true)
    try{
      if(doc && doc.id){
        await axios.patch(API + `/documents/${doc.id}`, {title, content_html: content}, {headers: {'X-User-Id': user.id}})
      } else {
        await axios.post(API + '/documents', {title, content_html: content}, {headers: {'X-User-Id': user.id}})
      }
      onSaved && onSaved()
      alert('Saved')
    }catch(e){
      console.error(e)
      alert('Save failed: ' + (e?.response?.data?.detail || e.message))
    }finally{setIsSaving(false)}
  }

  const discard = ()=>{
    if(doc){
      setTitle(doc.title || 'Untitled')
      setContent(doc.content_html || '')
    } else {
      setTitle('New Document')
      setContent('<p>Start writing...</p>')
    }
  }

  return (
    <div>
      <div style={{display:'flex', gap:8, alignItems:'center'}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} style={{flex:1, fontSize:18, padding:6}} />
        <button onClick={save} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</button>
        <button onClick={discard}>Discard</button>
      </div>

      <div style={{height:400, marginTop:12}}>
        <ReactQuill theme="snow" value={content} onChange={setContent} modules={{toolbar: [['bold','italic','underline'], [{ 'header': [1,2,3,false] }], [{'list':'ordered'},{'list':'bullet'}], ['link'] ]}} />
      </div>
    </div>
  )
}
