import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Building2, Plus, ArrowUpRight, ToggleLeft, ToggleRight, KeyRound, Check, AlertCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const SchoolsList = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // New School Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    principal_name: '',
    city: '',
    state: '',
    subscription_plan: 'standard',
    card_price: 50.00,
    admin_username: '',
    admin_password: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSchools();
    if (searchParams.get('add') === 'true') {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getSchools();
      setSchools(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to load schools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminApi.toggleSchoolStatus(id);
      fetchSchools();
    } catch (err) {
      alert('Failed to toggle school status');
    }
  };

  const handleCreateSchool = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await adminApi.createSchool(formData);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        principal_name: '',
        city: '',
        state: '',
        subscription_plan: 'standard',
        card_price: 50.00,
        admin_username: '',
        admin_password: '',
      });
      fetchSchools();
    } catch (err) {
      setFormError(
        err.response?.data?.detail ||
        'Error creating school. Please verify inputs.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSchools = schools.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.city?.toLowerCase().includes(q) ||
      s.principal_name?.toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      header: 'Institution',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Principal: <strong style={{ color: '#06b6d4' }}>{row.principal_name || 'Not assigned'}</strong>
          </div>
        </div>
      ),
    },
    {
      header: 'Location & Contact',
      render: (row) => (
        <div style={{ fontSize: '0.85rem' }}>
          <div>{row.city ? `${row.city}, ${row.state || ''}` : 'N/A'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{row.email || row.phone || ''}</div>
        </div>
      ),
    },
    {
      header: 'Students & Teachers',
      render: (row) => (
        <div>
          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{row.total_students || 0}</span> students
          <span style={{ color: 'var(--text-muted)' }}> • </span>
          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{row.total_teachers || 0}</span> teachers
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <button
          onClick={() => handleToggleStatus(row.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          title="Click to toggle status"
        >
          <span className={`badge badge-${row.status}`}>{row.status}</span>
          {row.status === 'active' ? (
            <ToggleRight size={20} color="#10b981" />
          ) : (
            <ToggleLeft size={20} color="#f43f5e" />
          )}
        </button>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/admin/schools/${row.id}`)}
          >
            Details <ArrowUpRight size={14} />
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/admin/school-security?school_id=${row.id}`)}
            title="Manage Credentials"
          >
            <KeyRound size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Building2 size={28} color="#4f46e5" /> Schools Directory
          </h1>
          <p className="page-subtitle">Manage multi-tenant schools, subscription plans, and administrative access</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} /> Register New School
        </button>
      </div>

      <Table
        columns={columns}
        data={filteredSchools}
        loading={loading}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by school name, code, or city..."
        emptyMessage="No schools found matching your search."
      />

      {/* Add School Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New School Institution"
        maxWidth="680px"
      >
        {formError && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleCreateSchool}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">School Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. DPS International"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Principal / Head Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Dr. John Doe"
                value={formData.principal_name}
                onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="admin@school.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Mumbai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Maharashtra"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
          </div>

          <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(79, 70, 229, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
            <div style={{ fontWeight: '700', fontSize: '0.875rem', color: '#818cf8', marginBottom: '0.75rem' }}>
              Create School Admin Login Credentials
            </div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Admin Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. school_dps002"
                  value={formData.admin_username}
                  onChange={(e) => setFormData({ ...formData, admin_username: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Admin Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={formData.admin_password}
                  onChange={(e) => setFormData({ ...formData, admin_password: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Registering...' : 'Register School'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default SchoolsList;

