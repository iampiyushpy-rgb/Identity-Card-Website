import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { KeyRound, ShieldAlert, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const SchoolSecurity = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getSchools();
      const list = res.data.results || res.data;
      setSchools(list);

      const targetId = searchParams.get('school_id');
      if (targetId) {
        const found = list.find((s) => String(s.id) === String(targetId));
        if (found) setSelectedSchool(found);
      }
    } catch (err) {
      console.error('Failed to load schools for security:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedSchool || !newPassword) return;
    setSubmitting(true);
    setMessage('');
    try {
      const res = await adminApi.resetSchoolPassword(selectedSchool.id, newPassword);
      setMessage(res.data.message || 'Password reset successfully.');
      setNewPassword('');
    } catch (err) {
      alert('Failed to reset password: ' + (err.response?.data?.error || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'School Institution',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Principal: {row.principal_name || 'Not assigned'}</div>
        </div>
      ),
    },
    {
      header: 'Linked Admin Account',
      render: (row) => (
        <div>
          {row.admin_user ? (
            <div>
              <strong style={{ color: '#818cf8' }}>{row.admin_user.username}</strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{row.admin_user.email}</div>
            </div>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No admin account yet</span>
          )}
        </div>
      ),
    },
    {
      header: 'Security Action',
      render: (row) => (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            setSelectedSchool(row);
            setMessage('');
            setNewPassword('');
          }}
        >
          <KeyRound size={14} /> Reset Password
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <KeyRound size={28} color="#4f46e5" /> School Security & Credential Management
          </h1>
          <p className="page-subtitle">Oversee school admin logins, reset credentials, and audit security access</p>
        </div>
      </div>

      <Table
        columns={columns}
        data={schools}
        loading={loading}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search schools..."
        emptyMessage="No schools available."
      />

      {/* Password Reset Modal */}
      <Modal
        isOpen={!!selectedSchool}
        onClose={() => setSelectedSchool(null)}
        title={`Reset Password for ${selectedSchool?.name}`}
        maxWidth="500px"
      >
        {message ? (
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-md)', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle2 size={18} />
            <div>
              <div style={{ fontWeight: '600' }}>Success!</div>
              <div style={{ fontSize: '0.85rem' }}>{message}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetPassword}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Set a new administrative password for <strong>{selectedSchool?.name}</strong>. If no administrator user exists yet, one will be automatically provisioned.
            </p>

            <div className="form-group">
              <label className="form-label">New Password *</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', background: 'transparent' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedSchool(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update School Password'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default SchoolSecurity;

