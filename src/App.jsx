import React from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API || "http://127.0.0.1:5000";

function useFetch(url) {
  const [data,setData]=React.useState(null);
  React.useEffect(()=>{ if(!url) return; fetch(url).then(r=>r.json()).then(setData); },[url]);
  return data;
}

function TopFilms() {
  const films = useFetch(`${API}/api/films/top`);
  if (!films) return <p className="loading">Loading top films…</p>;
  return (
    <div className="grid">
      {films.map(f=>(
        <Link key={f.film_id} to={`/films/${f.film_id}`} className="card">
          <h3>{f.title}</h3>
          <div className="meta">Rentals: {f.rental_count ?? f.rentals ?? "—"}</div>
          {f.category_name && <div className="meta">Category: {f.category_name}</div>}
        </Link>
      ))}
    </div>
  );
}

function FilmDetails() {
  const { id } = useParams();
  const data = useFetch(`${API}/api/films/${id}`);
  if (!data) return <p className="loading">Loading film…</p>;
  const { film, actors } = data;
  return (
    <div className="section">
      <div className="card">
        <h3>{film.title}</h3>
        <div className="meta" style={{marginBottom:8}}>
          {film.rating} • {film.length} min • {film.language}{film.category ? ` • ${film.category}` : ""}
        </div>
        <p style={{marginTop:8, lineHeight:1.5}}>{film.description}</p>
      </div>
      <div className="section">
        <h3 className="meta" style={{marginBottom:8}}>Actors</h3>
        <div className="grid">
          {actors.map(a=>(
            <div key={a.actor_id} className="card">
              <h3>{a.name}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="btnrow">
        <Link className="btn" to="/">← Home</Link>
      </div>
    </div>
  );
}

function TopActors() {
  const actors = useFetch(`${API}/api/actors/top`);
  if (!actors) return <p className="loading">Loading actors…</p>;
  return (
    <div className="grid">
      {actors.map(a=>(
        <Link key={a.actor_id} to={`/actors/${a.actor_id}`} className="card">
          <h3>{a.name}</h3>
          <div className="meta">Rentals: {a.rentals}</div>
        </Link>
      ))}
    </div>
  );
}

function ActorDetails() {
  const { id } = useParams();
  const data = useFetch(`${API}/api/actors/${id}/top-films`);
  if (!data) return <p className="loading">Loading actor…</p>;
  return (
    <div className="section">
      <div className="card"><h3>{data.actor.first_name} {data.actor.last_name}</h3></div>
      <div className="section">
        <h3 className="meta" style={{marginBottom:8}}>Top Films</h3>
        <div className="grid">
          {data.films.map(f=>(
            <Link key={f.film_id} to={`/films/${f.film_id}`} className="card">
              <h3>{f.title}</h3>
              <div className="meta">Rentals: {f.rentals}</div>
            </Link>
          ))}
        </div>
      </div>
      <div className="btnrow"><Link className="btn" to="/">← Home</Link></div>
    </div>
  );
}

function FilmSearch() {
  const [input,setInput]=React.useState("");
  const [q,setQ]=React.useState("");
  const results = useFetch(q ? `${API}/api/search?q=${encodeURIComponent(q)}` : null);
  return (
    <div className="section">
      <form onSubmit={e=>{e.preventDefault(); setQ(input.trim());}}>
        <input className="input" placeholder="Search by film, actor, or genre" value={input} onChange={e=>setInput(e.target.value)} />
      </form>
      <div className="section grid">
        {results?.map(f=>(
          <Link key={f.film_id} to={`/films/${f.film_id}`} className="card">
            <h3>{f.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Customers() {
  const [page,setPage]=React.useState(1);
  const data = useFetch(`${API}/api/customers?page=${page}&limit=20`);
  if (!data) return <p className="loading">Loading customers…</p>;
  return (
    <div className="section">
      <div className="grid">
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

function Home() {
  return (
    <div className="container">
      <div className="h1">Movie Store</div>
      <div className="nav">
        <Link to="/">Top Films</Link>
        <Link to="/actors">Top Actors</Link>
        <Link to="/search">Search</Link>
        <Link to="/customers">Customers</Link>
      </div>
      <TopFilms />
    </div>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/films/:id" element={<div className="container"><FilmDetails /></div>} />
        <Route path="/actors" element={<div className="container"><TopActors /></div>} />
        <Route path="/actors/:id" element={<div className="container"><ActorDetails /></div>} />
        <Route path="/search" element={<div className="container"><FilmSearch /></div>} />
        <Route path="/customers" element={<div className="container"><Customers /></div>} />
      </Routes>
    </BrowserRouter>
  );
}
