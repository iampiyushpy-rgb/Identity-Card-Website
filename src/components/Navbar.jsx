import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, User, School, ShieldCheck, BookOpen, Menu, Sun, Moon } from 'lucide-react';

export const Navbar = ({ onToggleMenu }) => {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const getRoleBadge = () => {
    switch (role) {
      case 'admin':
        return (
          <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <ShieldCheck size={13} /> <span className="badge-text">Super Admin</span>
          </span>
        );
      case 'school':
        return (
          <span className="badge" style={{ background: 'rgba(79, 70, 229, 0.15)', color: '#818cf8', border: '1px solid rgba(79, 70, 229, 0.3)' }}>
            <School size={13} /> <span className="badge-text">{user?.school_name || 'School Admin'}</span>
          </span>
        );
      case 'teacher':
        return (
          <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <BookOpen size={13} /> <span className="badge-text">Teacher</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header
      className="navbar-header"
      style={{
        height: 'var(--header-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Mobile Menu Toggle & Role Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          className="navbar-menu-btn"
          onClick={onToggleMenu}
          title="Open Menu"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        {getRoleBadge()}

        <div
          className="navbar-hologram-chip"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-color)',
            fontSize: '0.725rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div className="hologram-seal" style={{ width: '14px', height: '14px', fontSize: '0.5rem' }}>
            ✓
          </div>
          <span>SECURE ID PASS</span>
          <span style={{ color: '#06b6d4', fontWeight: '700' }}>• ACTIVE</span>
        </div>
      </div>

      {/* Right: Theme Switcher, User Profile & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Light / Dark Mode Toggle Logo */}
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-mode-toggle"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <div className="theme-toggle-icon-wrap">
            {isDark ? (
              <Moon size={15} className="theme-icon moon-icon" />
            ) : (
              <Sun size={15} className="theme-icon sun-icon" />
            )}
          </div>
          <span className="theme-mode-label">
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="navbar-user-details">
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              {user?.email || user?.username}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          title="Sign Out"
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem' }}
        >
          <LogOut size={15} />
          <span style={{ fontSize: '0.8rem' }}>Logout</span>
        </button>
      </div>
    </header>
  );
};
export default Navbar;

