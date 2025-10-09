import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../lib/useFetch";
const API = import.meta.env.VITE_API || "http://127.0.0.1:5000";

export default function CustomersPage() {
  const [page, setPage] = React.useState(1);
  const [q, setQ] = React.useState("");
  const [debounced, setDebounced] = React.useState("");
  const [refresh, setRefresh] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  const url = `${API}/api/customers?page=${page}&limit=20${
    debounced ? `&q=${encodeURIComponent(debounced)}` : ""
  }&r=${refresh}`;
  const data = useFetch(url);

  const [countries, setCountries] = React.useState([]);
  React.useEffect(() => {
    fetch(`${API}/api/countries`).then(r => r.json()).then(setCountries).catch(()=>{});
  }, []);

  const [add, setAdd] = React.useState({
    first_name: "", last_name: "", email: "",
    address: "", address2: "", district: "",
    city: "", country_id: "", postal_code: "", phone: "",
    store_id: 1
  });
  const onAdd = (k, v) => setAdd(s => ({ ...s, [k]: v }));

  async function addCustomer() {
    if (!add.first_name || !add.last_name || !add.address || !add.city || !add.country_id) {
      alert("First/Last, Address, City, and Country are required."); return;
    }
    const res = await fetch(`${API}/api/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(add),
    });
    const j = await res.json().catch(() => ({}));
    if (res.ok) {
      alert(`Added customer #${j.customer_id}`);
      setRefresh(x => x + 1);
      setAdd({ first_name:"", last_name:"", email:"", address:"", address2:"", district:"", city:"", country_id:"", postal_code:"", phone:"", store_id:1 });
    } else {
      alert(j.error || "Add failed");
    }
  }

  if (!data) return <div className="container"><p className="loading">Loading…</p></div>;

  return (
    <div className="container">
      <div className="h1">Customers</div>

      <input
        className="input"
        placeholder="Search by ID, first, or last"
        value={q}
        onChange={(e) => { setPage(1); setQ(e.target.value); }}
      />

      <div className="section grid">
        {data.data.map(c => (
          <Link key={c.customer_id} to={`/customers/${c.customer_id}`} className="card">
            <h3>{c.last_name}, {c.first_name}</h3>
            <div className="meta">ID: {c.customer_id}</div>
            <div className="meta">{c.email || "no email"}</div>
            {!c.active && <div className="meta">inactive</div>}
          </Link>
        ))}
      </div>

      <div className="btnrow">
        <button className="btn" onClick={() => setPage(Math.max(1, page - 1))}>Prev</button>
        <button className="btn" onClick={() => setPage(page + 1)}>Next</button>
      </div>

      <div className="section card">
        <h3>Add New Customer</h3>
        <div className="grid">
          <input className="input" placeholder="First Name" value={add.first_name} onChange={e=>onAdd("first_name", e.target.value)} />
          <input className="input" placeholder="Last Name" value={add.last_name} onChange={e=>onAdd("last_name", e.target.value)} />
          <input className="input" placeholder="Email" value={add.email} onChange={e=>onAdd("email", e.target.value)} />

          <input className="input" placeholder="Address" value={add.address} onChange={e=>onAdd("address", e.target.value)} />
          <input className="input" placeholder="Address 2" value={add.address2} onChange={e=>onAdd("address2", e.target.value)} />
          <input className="input" placeholder="District" value={add.district} onChange={e=>onAdd("district", e.target.value)} />

          <input className="input" placeholder="City" value={add.city} onChange={e=>onAdd("city", e.target.value)} />
          <select className="input" value={add.country_id} onChange={e=>onAdd("country_id", Number(e.target.value))}>
            <option value="">Select country</option>
            {countries.map(c => <option key={c.country_id} value={c.country_id}>{c.country}</option>)}
          </select>

          <input className="input" placeholder="Postal Code" value={add.postal_code} onChange={e=>onAdd("postal_code", e.target.value)} />
          <input className="input" placeholder="Phone" value={add.phone} onChange={e=>onAdd("phone", e.target.value)} />
        </div>

        <div className="btnrow">
          <button className="btn" onClick={addCustomer}>Add</button>
        </div>
      </div>
    </div>
  );
}
