import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import './App.css';
import Header from './components/Header/Header.js';
import Footer from './components/footer/footer.js';
import Categories from './pages/categories/categories.jsx';

function App() {
  return (
    <>
      <Header />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
