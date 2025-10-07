import { Link, useParams } from "react-router-dom";
import React from "react";
import useFetch from "../lib/useFetch";
const API = import.meta.env.VITE_API || "http://127.0.0.1:5000";

export default function FilmDetails(){
  const { id } = useParams();
  const data = useFetch(`${API}/api/films/${id}`);
  const [custId,setCustId]=React.useState("");
  const [msg,setMsg]=React.useState("");

  async function rent(){
    if(!custId) return;
    setMsg("Renting…");
    const res = await fetch(`${API}/api/rent`, {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ film_id:Number(id), customer_id:Number(custId) })
    });
    const j = await res.json();
    setMsg(res.ok ? `Rented! rental_id=${j.rental_id}` : (j.error || "Failed"));
  }

  if(!data) return <div className="container"><p className="loading">Loading film…</p></div>;
  const { film, actors } = data;

  return (
    <div className="container">
      <div className="card">
        <h3>{film.title}</h3>
        <div className="meta" style={{marginBottom:8}}>
          {film.rating} • {film.length} min • {film.language}{film.category?` • ${film.category}`:""}
        </div>
        <p style={{lineHeight:1.5}}>{film.description}</p>
      </div>

      <div className="section">
        <h3 className="meta" style={{marginBottom:8}}>Actors</h3>
        <div className="grid">
          {actors.map(a=> <div key={a.actor_id} className="card"><h3>{a.name}</h3></div>)}
        </div>
      </div>

      <div className="section card">
        <h3>Rent this film</h3>
        <div className="btnrow" style={{marginTop:8}}>
          <input className="input" style={{maxWidth:220}}
                 placeholder="Customer ID" value={custId}
                 onChange={e=>setCustId(e.target.value)} />
          <button className="btn" onClick={rent} disabled={!custId}>Rent</button>
        </div>
        {msg && <div className="meta" style={{marginTop:8}}>{msg}</div>}
      </div>

      <div className="btnrow"><Link className="btn" to="/">← Home</Link></div>
    </div>
  );
}
