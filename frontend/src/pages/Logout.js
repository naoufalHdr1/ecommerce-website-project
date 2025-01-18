import { useAuth } from '../contexts/authContext';

const Logout = () => {
  const { logout } = useAuth();

  logout();
  window.location.href = "/login";
};

export default Logout;

