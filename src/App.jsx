import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import React from "react";

const API = import.meta.env.VITE_API || "http://127.0.0.1:5000";

function useFetch(url) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    fetch(url).then(res => res.json()).then(setData).catch(console.error);
  }, [url]);
  return data;
}

function Home() {
  return (
    <div style={{padding:20}}>
      <h1>Movie Store</h1>
      <nav style={{marginBottom:20}}>
        <Link to="/">Top Films</Link> |{" "}
        <Link to="/actors">Top Actors</Link> |{" "}
        <Link to="/search">Search</Link>
      </nav>
      <TopFilms />
    </div>
  );
}


function TopFilms() {
  const films = useFetch(`${API}/api/films/top`);
  if (!films) return <p>Loading...</p>;
  return (
    <div style={{padding:20}}>
      <h2>Top 5 Films</h2>
      <ul>
        {films.map(f => (
          <li key={f.film_id}>
            <Link to={`/films/${f.film_id}`}>{f.title} ({f.rentals})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilmDetails() {
  const { id } = useParams();
  const data = useFetch(`${API}/api/films/${id}`);
  if (!data) return <p>Loading...</p>;
  return (
    <div style={{padding:20}}>
      <h2>{data.film.title}</h2>
      <p>{data.film.description}</p>
      <p>Length: {data.film.length} | Rating: {data.film.rating}</p>
      <h3>Actors</h3>
      <ul>
        {data.actors.map(a => (
          <li key={a.actor_id}>{a.name}</li>
        ))}
      </ul>
      <Link to="/">← Back</Link>
    </div>
  );
}

function TopActors() {
  const actors = useFetch(`${API}/api/actors/top`);
  if (!actors) return <p>Loading...</p>;
  return (
    <div style={{padding:20}}>
      <h2>Top 5 Actors</h2>
      <ul>
        {actors.map(a => (
          <li key={a.actor_id}>
            <Link to={`/actors/${a.actor_id}`}>{a.name} ({a.rentals})</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActorDetails() {
  const { id } = useParams();
  const data = useFetch(`${API}/api/actors/${id}/top-films`);
  if (!data) return <p>Loading...</p>;
  return (
    <div style={{padding:20}}>
      <h2>{data.actor.first_name} {data.actor.last_name}</h2>
      <h3>Top Films</h3>
      <ul>
        {data.films.map(f => (
          <li key={f.film_id}>
            <Link to={`/films/${f.film_id}`}>{f.title} ({f.rentals})</Link>
          </li>
        ))}
      </ul>
      <Link to="/">← Back</Link>
    </div>
  );
}

function FilmSearch() {
  const [input,setInput] = React.useState("");
  const [q,setQ] = React.useState("");
  const results = useFetch(q ? `${API}/api/search?q=${encodeURIComponent(q)}` : null);

  return (
    <div style={{padding:20}}>
      <h2>Search Films</h2>
      <form onSubmit={e=>{e.preventDefault(); setQ(input);}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Search by film, actor, or genre"/>
        <button>Search</button>
      </form>
      <ul>
        {results?.map(f => (
          <li key={f.film_id}><Link to={`/films/${f.film_id}`}>{f.title}</Link></li>
        ))}
      </ul>
    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/films/:id" element={<FilmDetails />} />
        <Route path="/actors" element={<TopActors />} />
        <Route path="/actors/:id" element={<ActorDetails />} />
        <Route path="/search" element={<FilmSearch />} />
      </Routes>
    </BrowserRouter>
  );
}
