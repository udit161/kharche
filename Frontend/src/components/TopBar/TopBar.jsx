import { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import './TopBar.css';

export default function TopBar({ title, subtitle }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="topbar" id="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title || 'Dashboard'}</h1>
        {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="search-input"
            id="search-input"
          />
        </div>

        <button
          className="topbar-theme-toggle"
          onClick={toggleTheme}
          id="theme-toggle-btn"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="topbar-notif" id="notification-btn">
          <Bell size={20} />
          <span className="notif-badge">3</span>
        </button>

        <div className="topbar-avatar" id="user-avatar">
          <div className="avatar-circle">
            <span>U</span>
          </div>
        </div>
      </div>
    </header>
  );
}

