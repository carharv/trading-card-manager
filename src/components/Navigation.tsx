// src/components/Navigation.tsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navigation.css";

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Search Cards
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/cards" className="nav-link">
            View All Cards
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/add-card" className="nav-link">
            Add Cards
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
