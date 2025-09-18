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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopFilms />} />
        <Route path="/films/:id" element={<FilmDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
