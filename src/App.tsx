// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CardListPage from "./pages/CardListPage";
import CardDetail from "./pages/CardDetail";
import AddCard from "./pages/AddCard";
import Navigation from "./components/Navigation";

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cards" element={<CardListPage />} />
        <Route path="/cards/:id" element={<CardDetail />} />
        <Route path="/add-card" element={<AddCard />} />
      </Routes>
    </Router>
  );
};

export default App;
