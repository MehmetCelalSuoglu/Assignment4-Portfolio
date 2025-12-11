import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Logo from "../src/assets/LogoMCS.jpeg";
import SuogluAIChat from "./SuogluAIChat.jsx";

export default function Layout() {
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  // Login status
  const jwtStr = localStorage.getItem("jwt");
  const jwt = jwtStr ? JSON.parse(jwtStr) : null;
  const isLoggedIn = !!jwt;
  const isAdmin = jwt?.user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/";
  };

  return (
    <div className="layoutWrapper">
      <header>
        <div className="logoArea">
          <img src={Logo} alt="Mehmet Celal Suoglu logo" />
          <h2>Mehmet Celal Suoglu</h2>
        </div>

        <nav>
          <Link className={isActive("/")} to="/">
            Home
          </Link>
          <Link className={isActive("/about")} to="/about">
            About
          </Link>
          <Link className={isActive("/education")} to="/education">
            Education
          </Link>
          <Link className={isActive("/project")} to="/project">
            Projects
          </Link>
          <Link className={isActive("/services")} to="/services">
            Services
          </Link>
          <Link className={isActive("/contact")} to="/contact">
            Contact
          </Link>

          {isLoggedIn && (
            <Link className={isActive("/profile")} to="/profile">
              Profile
            </Link>
          )}

          {isAdmin && (
            <Link className={isActive("/admin")} to="/admin">
              Admin
            </Link>
          )}

          {!isLoggedIn && (
            <>
              <Link className={isActive("/signin")} to="/signin">
                Sign In
              </Link>
              <Link className={isActive("/signup")} to="/signup">
                Sign Up
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="btn"
              style={{ marginLeft: "1.7rem" }}
            >
              Sign Out
            </button>
          )}
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>

      {/* SuogluAI Assistant chat widget (floating bottom-right) */}
      <SuogluAIChat />

      <footer className="footer">
        <p>Copyright © Mehmet Celal Suoglu, 301442929, COMP229, 2025</p>
      </footer>
    </div>
  );
}
