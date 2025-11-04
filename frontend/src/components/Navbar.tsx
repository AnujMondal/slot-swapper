import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          SlotSwapper
        </Link>
        <div className="navbar-menu">
          <Link
            to="/dashboard"
            className={`navbar-link ${isActive("/dashboard")}`}
          >
            Dashboard
          </Link>
          <Link
            to="/marketplace"
            className={`navbar-link ${isActive("/marketplace")}`}
          >
            Marketplace
          </Link>
          <Link
            to="/requests"
            className={`navbar-link ${isActive("/requests")}`}
          >
            Requests
          </Link>
        </div>
        <div className="navbar-user">
          <span className="user-name">{user?.name}</span>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
