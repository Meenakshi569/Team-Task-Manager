import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  if (isAuthPage || !user) {
    return null;
  }
  
  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          Task Manager
        </Link>
        
        <div className="navbar-nav">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/projects" className="nav-link">
            Projects
          </Link>
          <Link to="/tasks" className="nav-link">
            Tasks
          </Link>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {user.name} ({user.role})
          </span>
          <button onClick={logout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;