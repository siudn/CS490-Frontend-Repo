import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import LandingPage from "./pages/LandingPage";
import FilmsPage from "./pages/FilmsPage";
import FilmDetails from "./pages/FilmDetails";
import ActorsPage from "./pages/ActorsPage";
import ActorDetails from "./pages/ActorDetails";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetails from "./pages/CustomerDetails";

export default function App(){
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding:"30px 60px", background:"#0B1120", minHeight:"100vh", color:"#fff" }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/films" element={<FilmsPage />} />
          <Route path="/films/:id" element={<FilmDetails />} />
          <Route path="/actors" element={<ActorsPage />} />
          <Route path="/actors/:id" element={<ActorDetails />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
