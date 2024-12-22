import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

/*
 * Load my CSS styles After Bootstrap
 * This allows styles to take precedence.
 */
import './pages/Login.css'
import './components/InputField/InputField.css';
import './components/Banner/Banner.css';
import './components/Header/Header.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
