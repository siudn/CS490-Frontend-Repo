import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../lib/useFetch";
const API = import.meta.env.VITE_API || "http://127.0.0.1:5000";

export default function FilmsPage(){
  const [q,setQ]=React.useState("");
  const [debounced,setDebounced]=React.useState("");
  React.useEffect(()=>{
    const t=setTimeout(()=>setDebounced(q.trim()),300); return ()=>clearTimeout(t);
  },[q]);
  const results = useFetch(debounced ? `${API}/api/search?q=${encodeURIComponent(debounced)}` : null);

  return (
    <div className="container">
      <div className="h1">Search Films</div>
      <input className="input" placeholder="Search by film, actor, or genre" value={q}
             onChange={e=>setQ(e.target.value)} />
      <div className="section">
        {!debounced ? <p className="meta">Type to search…</p> :
         !results ? <p className="loading">Searching…</p> :
         results.length===0 ? <p className="meta">No results.</p> :
         <div className="grid">
           {results.map(f=>(
             <Link key={f.film_id} to={`/films/${f.film_id}`} className="card"><h3>{f.title}</h3></Link>
           ))}
         </div>}
      </div>
    </div>
  );
}
