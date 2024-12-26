import React from "react";
import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
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
import './components/Home/HomeBanner/HomeBanner.css';
import './components/Home/Products/product.css';
import './components/Home/Collections/Collection.css';
import './components/Home/Collections/categoryCard.css';
import './components/Home/services/benefitsSection.css';
import './components/footer/footer.css';
import './components/categories/heroSection/hero.css';
import './components/categories/categoryProductsPage/productsGrid.css';
import './components/categories/categoryProductsPage/filterSidebar.css';
import './components/categories/categoryProductsPage/categoryProductsPage.jsx';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
