import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CreditCard,
  TrendingUp,
  Sparkles,
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

  return (
    <aside className="sidebar" id="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Sparkles size={24} />
        </div>
        <span className="logo-text">Kharche</span>
      </div>

      {/* Navigation */}
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

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-stats">
          <TrendingUp size={16} />
          <span>Track wisely 💸</span>
        </div>
        <button className="logout-btn" id="logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
