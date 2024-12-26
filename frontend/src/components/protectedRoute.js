import { Navigate } from "react-router-dom";
import { api } from "../utils/api.js";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children, role }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // null indicates loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        const response = await api.get("/validate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if the user's role matches the required role
        if (response.data.role === role) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error("Authorization error:", err);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [role]);

  // Show loading while verifying
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect unauthorized users to the login page
  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected content
  return children;
};

export default ProtectedRoute;
