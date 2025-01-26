import { NotificationProvider } from "./utils/notificationContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/layout.js";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import Category from "./pages/categories/category";
import ProductPage from "./pages/product/productPage";
import ViewOrders from "./pages/userPage/viewOrders";
import PersonalDetails from "./pages/userPage/personalDetails";
import Checkout from "./pages/checkout/checkout";
import CategoryProductsPage from "./components/categories/categoryProductsPage/categoryProductsPage";
import Dashboard from "./pages/dashboard/dashboard";
import ProtectedRoute from "./components/protectedRoute.js";
import { StateProvider } from './components/dashboard/productSection/stateContext';
import { AuthProvider } from './contexts/authContext';
import { CartProvider } from './contexts/cartContext';

function App() {
  return (
    <NotificationProvider>
    <StateProvider>
    <AuthProvider>
    <CartProvider>
      <Router>
        <Routes>
          {/* Dashboard route without Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="admin">
                  <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout" element={<Checkout />} />

          {/* All other routes wrapped with Layout */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/shop/categories/:categoryName" element={<Category />} />
                  <Route path="/shop/categories/:categoryName/:subcategoryName/:id" element={<CategoryProductsPage />} />
                  <Route path="/shop/products/:id" element={<ProductPage />} />

                  {/* User Routes with Nested Sub-Routes */}
                  <Route path="/user">
                    <Route path="view-orders" element={<ViewOrders />} />
                    <Route path="personal-details" element={<PersonalDetails />} />
                  </Route>
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
    </AuthProvider>
		</StateProvider>
    </NotificationProvider>
  );
}

export default App;

