import { Link } from "react-router-dom";

export default function Navbar(){
  const link = { color:"#fff", margin:"0 12px", textDecoration:"none", fontWeight:500 };
  return (
    <nav style={{background:"#0B1120", padding:"12px 40px",
                 display:"flex", justifyContent:"space-between",
                 alignItems:"center", boxShadow:"0 2px 4px rgba(0,0,0,.2)"}}>
      <Link to="/" style={{color:"#fff", fontSize:"1.3rem", fontWeight:700, textDecoration:"none"}}>
        Sakila Rentals
      </Link>
      <div>
        <Link to="/" style={link}>Top Films</Link>
        <Link to="/actors" style={link}>Top Actors</Link>
        <Link to="/films" style={link}>Search</Link>
        <Link to="/customers" style={link}>Customers</Link>
      </div>
    </nav>
  );
}
