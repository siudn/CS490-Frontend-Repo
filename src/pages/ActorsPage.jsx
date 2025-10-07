import { Link } from "react-router-dom";
import useFetch from "../lib/useFetch";
const API = import.meta.env.VITE_API || "http://127.0.0.1:5000";

export default function ActorsPage(){
  const actors = useFetch(`${API}/api/actors/top`);
  return (
    <div className="container">
      <div className="h1">Top Actors</div>
      {!actors ? <p className="loading">Loading…</p> :
        <div className="grid">
          {actors.map(a=>(
            <Link key={a.actor_id} to={`/actors/${a.actor_id}`} className="card">
              <h3>{a.name}</h3><div className="meta">Rentals: {a.rentals}</div>
            </Link>
          ))}
        </div>}
    </div>
  );
}
