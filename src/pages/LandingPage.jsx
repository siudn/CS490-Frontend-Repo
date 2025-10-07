import { Link } from "react-router-dom";
import useFetch from "../lib/useFetch";
const API = import.meta.env.VITE_API || "http://127.0.0.1:5000";

export default function LandingPage(){
  const films = useFetch(`${API}/api/films/top`);
  return (
    <div className="container">
      <div className="h1">Movie Store</div>
      {!films ? <p className="loading">Loading top films…</p> :
        <div className="grid">
          {films.map(f=>(
            <Link key={f.film_id} to={`/films/${f.film_id}`} className="card">
              <h3>{f.title}</h3>
              <div className="meta">Rentals: {f.rental_count ?? f.rentals ?? "—"}</div>
              {f.category_name && <div className="meta">Category: {f.category_name}</div>}
            </Link>
          ))}
        </div>
      }
    </div>
  );
}
