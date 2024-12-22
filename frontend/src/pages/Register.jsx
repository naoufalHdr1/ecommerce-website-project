import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import InputField from '../components/InputField/InputField';
import BannerSection from '../components/Banner/Banner';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", { name, email, password });
      
      if (res && res.data && res.data.id) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        alert("Registration failed.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      alert("Registration failed: Please try again.");
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Left Section: Register Form */}
      <div className="login-side w-50 order-2 d-flex align-items-center justify-content-center">
        <div style={{ maxWidth: "400px", width: "100%" }}>
          <a href="/">
            <img src="logo.png" alt="Logo" className="mb-2" style={{ width: "200px" }}/>
          </a>
          <hr />
          <h2 className="mt-4 mb-3" style={{ fontWeight: "600" }}>
            Create your account
          </h2>
          <p className="text-muted mb-4">
            Please fill in your details to create an account.
          </p>
          <button className="btn btn-outline-dark w-100 mb-3 text-center">
            <img src="google.png" alt="Google Icon"/>
            Sign up with Google
          </button>

          <div className="separator">
            <span>or</span>
          </div>

          <form onSubmit={handleRegister}>
            <InputField
              type="text"
              id="name"
              value={name}
              label="Name"
              onChange={(e) => setName(e.target.value)}
            />
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
            <button
              type="submit"
              className="btn btn-dark w-100 m-3"
              style={{ fontWeight: "500" }}
            >
              Sign up
            </button>
          </form>
          <p className="text-center text-muted mt-3">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-decoration-none fw-bold text-dark"
            >
              Log in here
            </a>
          </p>
        </div>
      </div>

      {/* Right Section: Banner */}
      <BannerSection imageLink="banner1.jpg" position="right"/>
    </div>
  );
};

export default Register;

