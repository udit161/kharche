import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CreditCard,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, color: 'var(--coral)' },
  { path: '/profile', label: 'Profile', icon: User, color: 'var(--lavender)' },
  { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard, color: 'var(--teal)' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
            <defs>
              <linearGradient id="sb-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed"/>
                <stop offset="100%" stopColor="#4f46e5"/>
              </linearGradient>
              <linearGradient id="sb-coin-a" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd700"/>
                <stop offset="100%" stopColor="#c47a00"/>
              </linearGradient>
              <linearGradient id="sb-coin-b" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe44d"/>
                <stop offset="100%" stopColor="#b06800"/>
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="7" fill="url(#sb-bg)"/>
            <ellipse cx="21" cy="24" rx="6.5" ry="2.5" fill="url(#sb-coin-a)"/>
            <rect x="14.5" y="20.5" width="13" height="3.5" fill="url(#sb-coin-a)"/>
            <ellipse cx="21" cy="20.5" rx="6.5" ry="2.5" fill="#ffc300"/>
            <ellipse cx="21" cy="18.5" rx="6.5" ry="2.5" fill="url(#sb-coin-b)"/>
            <rect x="14.5" y="15" width="13" height="3.5" fill="url(#sb-coin-b)"/>
            <ellipse cx="21" cy="15" rx="6.5" ry="2.5" fill="#ffe44d"/>
            <ellipse cx="21" cy="13" rx="6.5" ry="2.5" fill="#ffd700"/>
            <rect x="14.5" y="9.5" width="13" height="3.5" fill="#ffd700"/>
            <ellipse cx="21" cy="9.5" rx="6.5" ry="2.5" fill="#ffe566"/>
            <ellipse cx="21" cy="9.5" rx="4.5" ry="1.5" fill="#fff8cc" opacity="0.5"/>
            <text x="5" y="23" fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900" fontSize="19" fill="white">K</text>
          </svg>
        </div>
        <span className="logo-text">Kharche</span>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  style={{ '--nav-color': item.color }}
                >
                  <div className="nav-icon-wrap">
                    <Icon size={20} />
                  </div>
                  <span className="nav-label">{item.label}</span>
                  {isActive && <div className="nav-active-dot" />}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-stats">
          <TrendingUp size={16} />
          <span>Track wisely 💸</span>
        </div>
        <button className="logout-btn" id="sidebar-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
