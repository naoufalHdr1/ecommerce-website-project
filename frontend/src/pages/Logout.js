import { useAuth } from '../contexts/authContext';

const Logout = () => {
  const { logout } = useAuth();

  localStorage.removeItem("token");
  logout();
  window.location.href = "/login";
};

export default Logout;

