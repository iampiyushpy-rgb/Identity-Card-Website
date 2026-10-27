import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { IdCard, ShieldCheck, School, BookOpen, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2, LogOut, Sun, Moon } from 'lucide-react';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticatingRole, setAuthenticatingRole] = useState(null);

  const { login, logout, user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const getDashboardPath = (userRole) => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'school') return '/school/dashboard';
    if (userRole === 'teacher') return '/teacher/dashboard';
    return '/';
  };

  const executeLogin = async (u, p) => {
    if (!u || !p) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    setLoading(true);

    const res = await login(u, p);
    setLoading(false);
    setAuthenticatingRole(null);

    if (res.success) {
      const destination = getDashboardPath(res.user?.role);
      navigate(destination, { replace: true });
    } else {
      setError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleFormSubmit = async (e) => {
    e?.preventDefault();
    await executeLogin(username, password);
  };

  const handleQuickKeycardLogin = async (roleName, u, p) => {
    setUsername(u);
    setPassword(p);
    setAuthenticatingRole(roleName);
    await executeLogin(u, p);
  };

  return (
    <div
      className="id-theme-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem 1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Quick Theme Switcher */}
      <button
        type="button"
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 50,
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-sm)',
          cursor: 'pointer',
          transition: 'var(--transition)',
        }}
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Lanyard & Clip Simulation */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '-6px', zIndex: 20 }}>
        <div className="lanyard-strap" title="TechRavisha Secure Lanyard"></div>
        <div className="metallic-clip">
          <div className="metallic-clip-pin"></div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 10 }}>
        {/* Main ID Access Card */}
        <div className="id-pass-card" style={{ padding: '0 1.35rem 1.25rem 1.35rem', borderRadius: '16px' }}>
          {/* Card Punch Hole */}
          <div className="badge-punch-slot"></div>

          {/* Card Top Header / Institution Brand */}
          <div
            style={{
              background: theme === 'light' 
                ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(6, 182, 212, 0.08) 100%)'
                : 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0.55rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <IdCard size={15} />
              </div>
              <div>
                <div 
                  className="id-pass-brand-title" 
                  style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
                >
                  Tech<span style={{ color: '#06b6d4' }}>Ravisha</span>
                </div>
                <div style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Identity & Access Pass
                </div>
              </div>
            </div>

            {/* Smart Chip & Hologram Seal */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <div className="smart-chip-gold" title="EMV Smart Security Chip"></div>
              <div className="hologram-seal" style={{ width: '22px', height: '22px', fontSize: '0.55rem' }} title="Authentic Holographic Seal">
                TR
              </div>
            </div>
          </div>

          {/* Active session banner if already logged in */}
          {isAuthenticated && user && (
            <div
              style={{
                background: theme === 'light' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '0.55rem 0.75rem',
                marginBottom: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: theme === 'light' ? '#059669' : '#34d399' }}>
                <CheckCircle2 size={15} />
                <span>Active: <strong>{user.username}</strong> ({user.role})</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => navigate(getDashboardPath(user.role))}
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                  title="Sign Out"
                >
                  <LogOut size={12} />
                </button>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1.2 }}>Access Authorization</h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Click any One-Click Keycard below or enter credentials manually
            </p>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                padding: '0.55rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.85rem',
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            <div className="form-group" style={{ marginBottom: '0.65rem' }}>
              <label className="form-label" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                Operator ID / Username
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. admin or school_sch001"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                autoComplete="username"
                style={{ padding: '0.48rem 0.75rem', fontSize: '0.825rem' }}
                required
              />
            </div>

            <div className="form-group" style={{ position: 'relative', marginBottom: '0.65rem' }}>
              <label className="form-label" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                Access PIN / Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter password (e.g. admin123)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="current-password"
                  style={{ padding: '0.48rem 2.2rem 0.48rem 0.75rem', fontSize: '0.825rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.65rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.35rem', padding: '0.6rem 0.75rem', fontSize: '0.85rem' }}
              disabled={loading}
            >
              {loading && !authenticatingRole ? (
                'Scanning Credentials...'
              ) : (
                <>
                  Authorize Pass <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Quick Keycards */}
          <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                One-Click Instant Keycards
              </span>
              <span style={{ fontSize: '0.62rem', color: '#06b6d4', fontWeight: '600' }}>
                Tap to Login
              </span>
            </div>
            <div className="login-keycards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm keycard-btn keycard-admin"
                onClick={() => handleQuickKeycardLogin('admin', 'admin', 'admin123')}
                disabled={loading}
                style={{
                  flexDirection: 'column',
                  gap: '0.15rem',
                  padding: '0.45rem 0.2rem',
                  border: authenticatingRole === 'admin' 
                    ? '1px solid #f87171' 
                    : (theme === 'light' ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)'),
                  background: authenticatingRole === 'admin' ? 'rgba(239, 68, 68, 0.2)' : undefined,
                  transition: 'all 0.2s ease',
                }}
              >
                <ShieldCheck size={14} color="#f87171" />
                <span className="keycard-title" style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-primary)' }}>Super Admin</span>
                <span className="keycard-sub" style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>admin123</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm keycard-btn keycard-school"
                onClick={() => handleQuickKeycardLogin('school', 'school_sch001', 'school123')}
                disabled={loading}
                style={{
                  flexDirection: 'column',
                  gap: '0.15rem',
                  padding: '0.45rem 0.2rem',
                  border: authenticatingRole === 'school' 
                    ? '1px solid #818cf8' 
                    : (theme === 'light' ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid rgba(99, 102, 241, 0.35)'),
                  background: authenticatingRole === 'school' ? 'rgba(99, 102, 241, 0.2)' : undefined,
                  transition: 'all 0.2s ease',
                }}
              >
                <School size={14} color="#818cf8" />
                <span className="keycard-title" style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-primary)' }}>School</span>
                <span className="keycard-sub" style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>school123</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm keycard-btn keycard-teacher"
                onClick={() => handleQuickKeycardLogin('teacher', 'teacher_sarah', 'teacher123')}
                disabled={loading}
                style={{
                  flexDirection: 'column',
                  gap: '0.15rem',
                  padding: '0.45rem 0.2rem',
                  border: authenticatingRole === 'teacher' 
                    ? '1px solid #34d399' 
                    : (theme === 'light' ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(16, 185, 129, 0.35)'),
                  background: authenticatingRole === 'teacher' ? 'rgba(16, 185, 129, 0.2)' : undefined,
                  transition: 'all 0.2s ease',
                }}
              >
                <BookOpen size={14} color="#34d399" />
                <span className="keycard-title" style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-primary)' }}>Teacher</span>
                <span className="keycard-sub" style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>teacher123</span>
              </button>
            </div>
            {authenticatingRole && (
              <div style={{ textAlign: 'center', marginTop: '0.35rem', fontSize: '0.65rem', color: '#06b6d4' }}>
                Authorizing {authenticatingRole} pass...
              </div>
            )}
          </div>

          {/* Barcode Strip at Bottom */}
          <div style={{ marginTop: '0.75rem' }}>
            <div className="security-barcode-strip" style={{ padding: '0.3rem 0.6rem' }}>
              <span className="barcode-sim" style={{ fontSize: '0.68rem' }}>|||| ||| ||||| || ||||</span>
              <span style={{ fontSize: '0.6rem', fontWeight: '700', color: '#64748b' }}>PASS-TR-2026-NFC</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          TechRavisha Smart Identity Systems • Encrypted Tenant Access
        </div>
      </div>
    </div>
  );
};

export default Login;

