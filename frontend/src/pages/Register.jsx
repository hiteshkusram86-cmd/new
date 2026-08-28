import React, { useState } from 'react'
import API from '../api'

export default function Register(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  async function submit(e){
    e.preventDefault();
    try{
      const res = await API.post('/api/auth/register', { email, password, name });
      setMsg(res.data.token ? 'Registered. You can now login.' : 'OK');
    }catch(err){
      setMsg(err?.response?.data?.error || 'Registration failed');
    }
  }

  return (
    <div className="auth">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        <button>Register</button>
      </form>
      {msg && <p className="msg">{msg}</p>}
    </div>
  )
}
