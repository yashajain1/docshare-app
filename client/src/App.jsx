import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Editor from './Editor'

const API = 'http://localhost:8000'

export default function App(){
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [docs, setDocs] = useState({owned:[], shared:[]})

  useEffect(()=>{
    axios.get(API + '/users').then(r=>setUsers(r.data))
  },[])

  useEffect(()=>{
    if(currentUser){
      axios.get(API + '/documents', {headers: {'X-User-Id': currentUser.id}}).then(r=>setDocs(r.data))
    }
  },[currentUser])

  if(!currentUser) return (
    <div style={{padding:20}}>
      <h2>Select User (mock login)</h2>
      {users.map(u=> <div key={u.id}><button onClick={()=>setCurrentUser(u)}>{u.name} ({u.email})</button></div>)}
    </div>
  )

  return (
    <div style={{padding:20}}>
      <h3>Signed in as {currentUser.name}</h3>
      <h4>Owned Documents</h4>
      <ul>{docs.owned.map(d=> <li key={d.id}>{d.title}</li>)}</ul>
      <h4>Shared With Me</h4>
      <ul>{docs.shared.map(d=> <li key={d.id}>{d.title} (owner: {d.owner_id})</li>)}</ul>
      <Editor user={currentUser} onSaved={()=>{
        axios.get(API + '/documents', {headers: {'X-User-Id': currentUser.id}}).then(r=>setDocs(r.data))
      }} />
    </div>
  )
}
