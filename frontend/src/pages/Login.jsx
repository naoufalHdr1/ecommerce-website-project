import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from '../components/InputField/InputField.js';
import BannerSection from '../components/Banner/Banner.js';
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      if (res?.data?.token) {
        sessionStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        alert("Login failed: No token received.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      alert("Login failed: Please try again.");
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Left Section: Login Form */}
      <div className="login-side w-50 d-flex align-items-center justify-content-center">
        <div style={{ maxWidth: "400px", width: "100%" }}>
          <a href="/">
            <img src="logo.png" alt="Logo" className="mb-2" style={{ width: "200px" }} />
          </a>
          <hr />
          <h2 className="mt-4 mb-3" style={{ fontWeight: "600" }}>Welcome back,</h2>
          <p className="text-muted mb-4">Please enter your details.</p>

          <button className="btn btn-outline-dark w-100 mb-3 text-center">
            <img src="google.png" alt="Google Icon" /> Log in with Google
          </button>

          <div className="separator">
            <span>or</span>
          </div>

          <form onSubmit={handleLogin}>
            <InputField
              type="email"
              id="email"
              value={email}
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              type="password"
              id="password"
              value={password}
              label="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="d-flex justify-content-between mb-4">
              <div>
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe" className="ms-2 text-muted">Remember me</label>
              </div>
              <a href="/forgot-password" className="text-dark fw-bold">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="btn btn-dark w-100 m-3"
              style={{ fontWeight: "500" }}
            >
              Log in
            </button>
          </form>

          <p className="text-center text-muted mt-3">
            Don’t have an account? 
            <a href="/register" className="text-decoration-none fw-bold text-dark"> Sign up for free</a>
          </p>
        </div>
      </div>

      {/* Right Section: Banner */}
      <BannerSection imageLink="banner.jpg" position="left"/>
    </div>
  );
};

export default Login;

