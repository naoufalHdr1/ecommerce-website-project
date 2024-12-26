import AppNavbar from './navbar';
import Sidebar from './sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <AppNavbar />
      <div className="d-flex">
        <Sidebar />
        <div className="content flex-grow-1 p-4">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
