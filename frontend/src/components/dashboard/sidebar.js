const Sidebar = () => {
  return (
    <div className="sidebar bg-light">
      <ul className="list-unstyled">
        <li>
          <a href="#dashboard" className="d-flex align-items-center p-2">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </a>
        </li>
        <li>
          <a href="#users" className="d-flex align-items-center p-2">
            <i className="bi bi-people me-2"></i> Users
          </a>
        </li>
        <li>
          <a href="#settings" className="d-flex align-items-center p-2">
            <i className="bi bi-gear me-2"></i> Settings
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
