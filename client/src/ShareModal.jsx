import React, { useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000'

export default function ShareModal({doc, users, currentUser, onClose}){
  const [selected, setSelected] = useState('')
  const [role, setRole] = useState('reader')
  const share = async ()=>{
    if(!selected){ alert('Select a user to share with'); return }
    try{
      await axios.post(API + `/documents/${doc.id}/share`, {user_id: parseInt(selected), role}, {headers: {'X-User-Id': currentUser.id}})
      alert('Shared')
      onClose && onClose()
    }catch(e){
      console.error(e)
      alert('Share failed: ' + (e?.response?.data?.detail || e.message))
    }
  }

  return (
    <div style={{position:'fixed', left:0, right:0, top:0, bottom:0, background:'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{background:'#fff', padding:20, minWidth:360}}>
        <h3>Share: {doc.title}</h3>
        <div>
          <select value={selected} onChange={e=>setSelected(e.target.value)}>
            <option value="">Select user</option>
            {users.filter(u=>u.id !== currentUser.id).map(u=> <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
          </select>
        </div>
        <div style={{marginTop:8}}>
          <label>Role: </label>
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="reader">Reader</option>
            <option value="editor">Editor</option>
          </select>
        </div>
        <div style={{marginTop:12}}>
          <button onClick={share}>Share</button>
          <button onClick={onClose} style={{marginLeft:8}}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
