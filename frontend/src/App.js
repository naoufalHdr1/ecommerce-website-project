import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import './App.css';
import Header from './components/Header/Header.js';
import Footer from './components/footer/footer.js';
import Category from './pages/categories/category.jsx';

function App() {
  return (
    <>
      <Header />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categories/:category" element={<Category />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
