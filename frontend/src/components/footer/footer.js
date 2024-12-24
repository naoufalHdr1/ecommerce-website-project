import React from "react";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container py-5">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4">
            <h5 className="footer-title">About Us</h5>
            <p className="footer-description">
              We are committed to providing top-notch products with a seamless shopping experience. Our mission is to bring you quality, value, and customer satisfaction.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#categories">Categories</a></li>
              <li><a href="#benefits">Why Choose Us</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-md-4">
            <h5 className="footer-title">Contact Us</h5>
            <ul className="list-unstyled footer-contact">
              <li><i className="bi bi-geo-alt"></i> 123 Main Street, City, Country</li>
              <li><i className="bi bi-telephone"></i> +1 234 567 890</li>
              <li><i className="bi bi-envelope"></i> support@example.com</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="footer-divider my-4" />

        {/* Copyright and Social Links */}
        <div className="footer-bottom text-center">
          <p className="mb-2">© 2024 Your Company. All Rights Reserved.</p>
          <div className="social-icons">
            <a href="https://facebook.com" className="social-icon"><i className="bi bi-facebook"></i></a>
            <a href="https://twitter.com" className="social-icon"><i className="bi bi-twitter"></i></a>
            <a href="https://instagram.com" className="social-icon"><i className="bi bi-instagram"></i></a>
            <a href="https://linkedin.com" className="social-icon"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
