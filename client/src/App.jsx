import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Editor from './Editor'
import ShareModal from './ShareModal'
import Upload from './Upload'

const API = 'http://localhost:8000'

export default function App(){
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [docs, setDocs] = useState({owned:[], shared:[]})
  const [currentDoc, setCurrentDoc] = useState(null)
  const [showShare, setShowShare] = useState(false)

  useEffect(()=>{
    axios.get(API + '/users').then(r=>setUsers(r.data))
  },[])

  const loadDocs = () => {
    if(currentUser){
      axios.get(API + '/documents', {headers: {'X-User-Id': currentUser.id}}).then(r=>setDocs(r.data)).catch(err=>console.error(err))
    }
  }

  useEffect(()=>{
    loadDocs()
  },[currentUser])

  const openDoc = (doc) => {
    // fetch full doc to ensure fresh content
    axios.get(API + `/documents/${doc.id}`, {headers: {'X-User-Id': currentUser.id}}).then(r=>{
      setCurrentDoc(r.data)
    }).catch(err=>{
      alert('Cannot open document: ' + err?.response?.data?.detail || err.message)
    })
  }

  const onSaved = ()=>{
    loadDocs()
    setCurrentDoc(null)
  }

  return (
    <div style={{padding:20}}>
      {!currentUser ? (
        <div>
          <h2>Select User (mock login)</h2>
          {users.map(u=> <div key={u.id}><button onClick={()=>setCurrentUser(u)}>{u.name} ({u.email})</button></div>)}
        </div>
      ) : (
        <div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h3>Signed in as {currentUser.name}</h3>
            <div>
              <button onClick={()=>{setCurrentUser(null); setCurrentDoc(null)}}>Sign out</button>
            </div>
          </div>

          <div style={{display:'flex', gap:20}}>
            <div style={{width:'30%'}}>
              <h4>Owned Documents</h4>
              <ul>
                {docs.owned.map(d=> <li key={d.id}>
                  <strong>{d.title}</strong>
                  <div style={{fontSize:12}}>Updated: {new Date(d.updated_at).toLocaleString()}</div>
                  <div style={{marginTop:6}}>
                    <button onClick={()=>openDoc(d)}>Open</button>
                    <button onClick={()=>{setCurrentDoc(d); setShowShare(true)}} style={{marginLeft:6}}>Share</button>
                  </div>
                </li>)}
              </ul>

              <h4>Shared With Me</h4>
              <ul>
                {docs.shared.map(d=> <li key={d.id}>{d.title} (owner: {d.owner_id}) <button onClick={()=>openDoc(d)} style={{marginLeft:6}}>Open</button></li>)}
              </ul>

              <div style={{marginTop:20}}>
                <Upload user={currentUser} onUploaded={()=>loadDocs()} />
              </div>
            </div>

            <div style={{flex:1}}>
              <Editor user={currentUser} doc={currentDoc} onSaved={onSaved} />
            </div>
          </div>

          {showShare && currentDoc && (
            <ShareModal doc={currentDoc} users={users} currentUser={currentUser} onClose={()=>{setShowShare(false); setCurrentDoc(null); loadDocs()}} />
          )}
        </div>
      )}
    </div>
  )
}
