import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from '../../contexts/authContext';
import Badge from '@mui/material/Badge';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import UserMenu from './userMenu';
import CartDrawer from './cart'
import { useStateContext } from '../../components/dashboard/productSection/stateContext';
import { useCart } from '../../contexts/cartContext'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const { state } = useStateContext(); 
  const { state: cartItems } = useCart();
  const { categories, subcategories } = state; 
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleCartDrawer = (newOpen) => () => {
    setCartOpen(newOpen);
  };

  return (
    <header>
      {/* Top Bar */}
      <div className="bg-dark text-white py-2 px-5 d-md-flex justify-content-between align-items-center">
        <p className="top-bar-left mb-0 fw-bold">Free shipping, 30-day return or refund guarantee.</p>
        <div className="top-bar-links">
          {isLoggedIn ? (
            <a href="/logout" className="text-white text-decoration-none me-3">
              <LogoutIcon fontSize="small" /> LOG OUT
            </a>
          ) : (
            <>
              <a href="/login" className="text-white text-decoration-none me-3">
                <LoginIcon fontSize="small"/> SIGN IN
              </a>
              <a href="/register" className="text-white text-decoration-none me-3">
                <PersonAddIcon fontSize="small"/> SIGN UP
              </a>
            </>
          )}
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
            <img src="/logo.png" alt="Male Fashion Logo" className="img-fluid" style={{ maxWidth: "150px" }} />
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
                <li className="nav-item dropdown" key={to}>
                  <NavLink
                    to={to}
                    className="nav-link text-dark"
                    activeClassName="active"
                  >
                    {label}
                  </NavLink>
                  {/* Only display the dropdown for the "Shop" menu */}
                    {label === "Shop" && (
                      <div className="dropdown-menu">
                        {categories?.map((cat) => (
                          <div className="dropdown-column" key={cat._id}>
                            {/* Add hyperlink for category */}
                            <NavLink to={`/shop/categories/${cat.name}`} className="category-link">
                              <strong>{cat.name}</strong>
                            </NavLink>
                            <ul>
                              {cat.subcategories && cat.subcategories.length > 0 ? (
                                cat.subcategories.map((subcatId) => {
                                  // Find the subcategory by its ID
                                  const subcat = subcategories.find((sc) => sc._id === subcatId);
                                  return subcat ? (
                                    <li key={subcat._id}>
                                      {/* Add hyperlink for subcategory */}
                                      <NavLink
                                        to={`/shop/categories/${cat.name}/${subcat.name}/${subcat._id}`}
                                        className="subcategory-link"
                                      >
                                        - {subcat.name}
                                      </NavLink>
                                    </li>
                                  ) : null;
                                })
                              ) : (
                                <li>
                                  <em>No subcategories available</em>
                                </li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                </li>
              ))}
            </ul>
          </nav>

          {/* Icons (large screens) */}
          <div className="d-none d-md-flex align-items-center">
            <i key='heart' className={`bi bi-heart ms-4 fs-5 icon-hover`}></i>
            <Badge badgeContent={cartItems.items?.length} color="error">
              <i
                key='bag'
                className={`bi bi-bag ms-4 fs-5 icon-hover`}
                onClick={toggleCartDrawer(true)}
              >
              </i>
            </Badge>
            {isLoggedIn && (
              <UserMenu />
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={toggleCartDrawer(false)}
      />

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
