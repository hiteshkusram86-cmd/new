import React, { useEffect, useState } from 'react'
import API from '../api'

function ProfileCard({ p }){
  return (
    <div className="card">
      <img src={p.avatar || 'https://via.placeholder.com/80'} alt="avatar" />
      <div>
        <h3>{p.title || p.user?.name}</h3>
        <p>{p.bio}</p>
        <p><strong>Skills:</strong> {p.skills}</p>
        <p><small>{p.location}</small></p>
      </div>
    </div>
  )
}

export default function Home(){
  const [profiles, setProfiles] = useState([]);
  const [q, setQ] = useState('');

  useEffect(()=>{ load(); }, []);

  async function load(){
    const res = await API.get('/api/profiles');
    setProfiles(res.data || []);
  }

  async function search(e){
    e.preventDefault();
    const res = await API.get('/api/profiles', { params: { q } });
    setProfiles(res.data || []);
  }

  return (
    <div>
      <form onSubmit={search} className="search">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by skills, title, location..." />
        <button>Search</button>
        <button type="button" onClick={load}>Reset</button>
      </form>
      <div className="list">
        {profiles.map(p=> <ProfileCard key={p.id} p={p} />)}
      </div>
    </div>
  )
}
