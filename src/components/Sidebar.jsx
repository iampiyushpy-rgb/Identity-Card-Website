import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  ShieldCheck,
  KeyRound,
  GraduationCap,
  Layers,
  UserCheck,
  UserPlus,
  RefreshCw,
  IdCard,
  X,
} from 'lucide-react';

export const Sidebar = ({ isOpen = false, onClose }) => {
  const { role } = useAuth();

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Schools Directory', path: '/admin/schools', icon: Building2 },
    { name: 'Payment History', path: '/admin/payments', icon: CreditCard },
    { name: 'School Security', path: '/admin/school-security', icon: KeyRound },
    { name: 'Profile & Security', path: '/admin/profile-security', icon: ShieldCheck },
  ];

  const schoolLinks = [
    { name: 'Dashboard', path: '/school/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/school/students', icon: GraduationCap },
    { name: 'Classes & Sections', path: '/school/classes', icon: Layers },
    { name: 'Session Change', path: '/school/session-change', icon: RefreshCw },
    { name: 'Teacher Profiles', path: '/school/teachers', icon: UserCheck },
    { name: 'Payment History', path: '/school/payments', icon: CreditCard },
  ];

  const teacherLinks = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Students List', path: '/teacher/students', icon: Users },
    { name: 'Add Student', path: '/teacher/add-student', icon: UserPlus },
  ];

  let links = [];
  if (role === 'admin') links = adminLinks;
  else if (role === 'school') links = schoolLinks;
  else if (role === 'teacher') links = teacherLinks;

  return (
    <aside
      className={`sidebar-container ${isOpen ? 'sidebar-open' : ''}`}
      style={{
        width: 'var(--sidebar-width)',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Brand Header & Mobile Close */}
      <div
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
              position: 'relative',
              flexShrink: 0,
            }}
          >
            <IdCard size={20} />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Tech<span style={{ color: '#06b6d4' }}>Ravisha</span>
              <div className="rfid-wave-ring" title="Smart NFC/RFID Online">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
              Smart ID Card Suite
            </div>
          </div>
        </div>

        {/* Close Button for Mobile Drawer */}
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          title="Close Navigation"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ padding: '1.5rem 1rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.75rem', paddingLeft: '0.75rem' }}>
          Main Menu
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Bottom Info Card */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div
          style={{
            background: 'var(--bg-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            border: '1px solid var(--border-color)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Next-Gen System</div>
          <div>RFID & QR Smart ID generation enabled.</div>
        </div>
      </div>
    </aside>
  );
};
