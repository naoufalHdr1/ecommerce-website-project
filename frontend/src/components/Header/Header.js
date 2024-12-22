import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header>
      {/* Top Bar */}
      <div className="bg-dark text-white py-2 px-5 d-md-flex justify-content-between align-items-center">
        <p className="top-bar-left mb-0 fw-bold">Free shipping, 30-day return or refund guarantee.</p>
        <div className="top-bar-links">
          <a href="/login" className="text-white text-decoration-none me-3">SIGN IN</a>
          <a href="/faqs" className="text-white text-decoration-none me-3">FAQs</a>
          <select className="form-select form-select-sm d-inline-block w-auto bg-dark text-white border">
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="mad">MAD</option>
          </select>
        </div>
      </div>

      {/* Main Header */}
      <div className="py-3 border-bottom px-4">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <a href="/" className="header-logo">
            <img src="logo.png" alt="Male Fashion Logo" className="img-fluid" style={{ maxWidth: "150px" }} />
          </a>

          {/* Navbar Toggler (small screens) */}
          <button className="navbar-toggler d-md-none" onClick={toggleMenu}>
            <i className="bi bi-list fs-1"></i>
          </button>

          {/* Navigation (large screens) */}
          <nav className="navbar navbar-expand-md d-md-flex d-none">
            <ul className="navbar-nav mx-auto">
              {[
                { to: "/", label: "Home" },
                { to: "/shop", label: "Shop" },
                { to: "/pages", label: "Pages" },
                { to: "/blog", label: "Blog" },
                { to: "/contacts", label: "Contacts" },
              ].map(({ to, label }) => (
                <li className="nav-item" key={to}>
                  <NavLink to={to} className="nav-link text-dark" activeClassName="active">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Icons (large screens) */}
          <div className="d-none d-md-flex align-items-center">
            {["search", "heart", "bag"].map((icon) => (
              <i key={icon} className={`bi bi-${icon} me-4 fs-5 icon-hover`}></i>
            ))}
          </div>
        </div>
      </div>

      {/* Side Menu */}
      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleMenu}>
          <i className="bi bi-x-square fs-1"></i>
        </button>
        <div className="side-menu-content px-3 py-5">
          {/* Top Section */}
          <div className="top-section d-flex justify-content-evenly align-items-center mb-4">
            <a href="/login" className="text-dark text-decoration-none">SIGN IN</a>
            <a href="/faqs" className="text-dark text-decoration-none">FAQs</a>
            <select className="form-select form-select-sm w-auto">
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
              <option value="mad">MAD</option>
            </select>
          </div>

          {/* Icons Section */}
          <div className="icons-section d-flex justify-content-around mb-4">
            {["search", "heart", "bag"].map((icon) => (
              <i key={icon} className={`bi bi-${icon}`}></i>
            ))}
          </div>

          {/* Navigation Menu */}
          <ul className="navbar-nav mt-4">
            {[
              { to: "/", label: "Home" },
              { to: "/shop", label: "Shop" },
              { to: "/pages", label: "Pages" },
              { to: "/blog", label: "Blog" },
              { to: "/contacts", label: "Contacts" },
            ].map(({ to, label }) => (
              <li className="nav-item" key={to}>
                <NavLink to={to} className="nav-link text-dark">
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
