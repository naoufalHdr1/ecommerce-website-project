import { NotificationProvider } from "./utils/notificationContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/layout.js";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Category from "./pages/categories/category";
import CategoryProductsPage from "./components/categories/categoryProductsPage/categoryProductsPage";
import Dashboard from "./pages/dashboard/dashboard";

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Dashboard route without Layout */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* All other routes wrapped with Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/categories/:category" element={<Category />} />
                  <Route path="/a" element={<CategoryProductsPage />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;

