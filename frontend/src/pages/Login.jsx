import React, { useState } from 'react'
import API, { setAuthToken } from '../api'

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e){
    e.preventDefault();
    try{
      const res = await API.post('/api/auth/login', { email, password });
      if(res.data.token){
        setAuthToken(res.data.token);
        localStorage.setItem('devhub_token', res.data.token);
        setMsg('Logged in. Refresh to see protected actions.');
      }
    }catch(err){
      setMsg(err?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="auth">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        <button>Login</button>
      </form>
      {msg && <p className="msg">{msg}</p>}
    </div>
  )
}
