import React from "react";
import useFetch from "../lib/useFetch";
const API = import.meta.env.VITE_API || "http://127.0.0.1:5000";

export default function CustomersPage(){
  const [page,setPage]=React.useState(1);
  const [q,setQ]=React.useState("");
  const [debounced,setDebounced]=React.useState("");
  React.useEffect(()=>{ const t=setTimeout(()=>setDebounced(q.trim()),300); return ()=>clearTimeout(t); },[q]);
  const url = `${API}/api/customers?page=${page}&limit=20${debounced?`&q=${encodeURIComponent(debounced)}`:""}`;
  const data = useFetch(url);

  if(!data) return <div className="container"><p className="loading">Loading…</p></div>;
  return (
    <div className="container">
      <div className="h1">Customers</div>
      <input className="input" placeholder="Search by ID, first, or last"
             value={q} onChange={e=>{setPage(1); setQ(e.target.value);}} />
      <div className="section grid">
        {data.data.map(c=>(
          <div key={c.customer_id} className="card">
            <h3>{c.last_name}, {c.first_name}</h3>
            <div className="meta">ID: {c.customer_id}</div>
            <div className="meta">{c.email || "no email"}</div>
            {!c.active && <div className="meta">inactive</div>}
          </div>
        ))}
      </div>
      <div className="btnrow">
        <button className="btn" onClick={()=>setPage(Math.max(1,page-1))}>Prev</button>
        <button className="btn" onClick={()=>setPage(page+1)}>Next</button>
      </div>
    </div>
  );
}
