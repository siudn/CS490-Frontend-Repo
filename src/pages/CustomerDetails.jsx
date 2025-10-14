import React from "react";
import { useParams, useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API || "http://127.0.0.1:5000";

export default function CustomerDetails(){
  const { id } = useParams();
  const nav = useNavigate();

  const [countries, setCountries] = React.useState([]);
  const [form, setForm] = React.useState(null);
  const [rentals, setRentals] = React.useState({ open: [], returned: [] });
  const on = (k,v)=>setForm(s=>({...s,[k]:v}));

  React.useEffect(()=>{
    fetch(`${API}/api/countries`).then(r=>r.json()).then(setCountries).catch(()=>{});
    fetch(`${API}/api/customers/${id}`).then(r=>r.json()).then(j=>{
      setForm({
        customer_id:j.customer_id, active:j.active,
        first_name:j.first_name||"", last_name:j.last_name||"", email:j.email||"",
        address:j.address||"", address2:j.address2||"", district:j.district||"",
        postal_code:j.postal_code||"", phone:j.phone||"",
        city:j.city||"", city_id:j.city_id||"", country_id:j.country_id||""
      });
    });
    loadRentals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[id]);

  async function loadRentals(){
    const r = await fetch(`${API}/api/customers/${id}/rentals`);
    if(r.ok) setRentals(await r.json());
  }

  async function save(){
    const res = await fetch(`${API}/api/customers/${id}`, {
      method:"PUT", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(form)
    });
    alert(res.ok ? "Updated" : "Update failed");
  }

  async function remove(){
    if(!confirm(`Delete customer #${id}? This removes rentals/payments.`)) return;
    const res = await fetch(`${API}/api/customers/${id}`, { method:"DELETE" });
    if(res.ok){ alert("Deleted"); nav("/customers"); } else alert("Delete failed"); 
  }

  async function markReturned(rentalId){
    const r = await fetch(`${API}/api/rentals/${rentalId}/return`, { method:"POST" });
    if(r.ok){ await loadRentals(); } else { alert("No open rental for that ID"); }
  }

  if(!form) return <div className="container"><p className="loading">Loading…</p></div>;

  return (
    <div className="container">
      <div className="h1">Customer #{id}</div>
      <div className="card">
        <div className="grid">
          <input className="input" placeholder="First Name" value={form.first_name} onChange={e=>on("first_name",e.target.value)} />
          <input className="input" placeholder="Last Name" value={form.last_name} onChange={e=>on("last_name",e.target.value)} />
          <input className="input" placeholder="Email" value={form.email} onChange={e=>on("email",e.target.value)} />
          <input className="input" placeholder="Address" value={form.address} onChange={e=>on("address",e.target.value)} />
          <input className="input" placeholder="Address 2" value={form.address2} onChange={e=>on("address2",e.target.value)} />
          <input className="input" placeholder="District" value={form.district} onChange={e=>on("district",e.target.value)} />
          <input className="input" placeholder="Postal Code" value={form.postal_code} onChange={e=>on("postal_code",e.target.value)} />
          <input className="input" placeholder="Phone" value={form.phone} onChange={e=>on("phone",e.target.value)} />
          <input className="input" placeholder="City" value={form.city} onChange={e=>{on("city",e.target.value); on("city_id","");}} />
          <select className="input" value={form.country_id} onChange={e=>on("country_id", Number(e.target.value))}>
            <option value="">Select country</option>
            {countries.map(c => <option key={c.country_id} value={c.country_id}>{c.country}</option>)}
          </select>
        </div>
        <div className="btnrow" style={{marginTop:12}}>
          <button className="btn" onClick={save}>Save</button>
          <button className="btn" style={{background:"#b33"}} onClick={remove}>Delete</button>
        </div>
      </div>
      <div className="section">
        <h3 className="meta" style={{marginBottom:8}}>Open Rentals</h3>
        {rentals.open.length === 0 ? <p className="meta">None</p> :
          <div className="grid">
            {rentals.open.map(r => (
              <div key={r.rental_id} className="card">
                <h3>{r.title}</h3>
                <div className="meta">Rental ID: {r.rental_id}</div>
                <div className="meta">Rented: {new Date(r.rental_date).toLocaleString()}</div>
                <div className="btnrow" style={{marginTop:8}}>
                  <button className="btn" onClick={()=>markReturned(r.rental_id)}>Mark Returned</button>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      <div className="section">
        <h3 className="meta" style={{marginBottom:8}}>Returned Rentals</h3>
        {rentals.returned.length === 0 ? <p className="meta">None</p> :
          <div className="grid">
            {rentals.returned.map(r => (
              <div key={r.rental_id} className="card">
                <h3>{r.title}</h3>
                <div className="meta">Rental ID: {r.rental_id}</div>
                <div className="meta">Rented: {new Date(r.rental_date).toLocaleString()}</div>
                <div className="meta">Returned: {new Date(r.return_date).toLocaleString()}</div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}
