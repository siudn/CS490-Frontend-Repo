import { Link, useParams } from "react-router-dom";
import useFetch from "../lib/useFetch";
const API = import.meta.env.VITE_API || "http://127.0.0.1:5000";

export default function ActorDetails(){
  const { id } = useParams();
  const data = useFetch(`${API}/api/actors/${id}/top-films`);
  if(!data) return <div className="container"><p className="loading">Loading…</p></div>;
  return (
    <div className="container">
      <div className="card"><h3>{data.actor.first_name} {data.actor.last_name}</h3></div>
      <div className="section">
        <h3 className="meta" style={{marginBottom:8}}>Top Films</h3>
        <div className="grid">
          {data.films.map(f=>(
            <Link key={f.film_id} to={`/films/${f.film_id}`} className="card">
              <h3>{f.title}</h3><div className="meta">Rentals: {f.rentals}</div>
            </Link>
          ))}
        </div>
      </div>
      <div className="btnrow"><Link className="btn" to="/">← Home</Link></div>
    </div>
  );
}
