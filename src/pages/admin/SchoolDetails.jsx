import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { StatsCard } from '../../components/StatsCard';
import { Building2, ArrowLeft, Users, UserCheck, CreditCard, ShieldCheck, Mail, Phone, MapPin, Globe } from 'lucide-react';

export const SchoolDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchool();
  }, [id]);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getSchool(id);
      setSchool(res.data);
    } catch (err) {
      console.error('Failed to fetch school details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading institution details...</div>;
  }

  if (!school) {
    return <div style={{ padding: '2rem', color: 'var(--accent-rose)' }}>School not found.</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/schools')}>
          <ArrowLeft size={16} /> Back to Schools Directory
        </button>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Building2 size={28} color="#4f46e5" /> {school.name}
          </h1>
          <p className="page-subtitle">
            Principal: <strong style={{ color: '#06b6d4' }}>{school.principal_name || 'Not assigned'}</strong> • Status: {school.status?.toUpperCase()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/admin/school-security?school_id=${school.id}`)}
          >
            <ShieldCheck size={16} /> Reset Password
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid">
        <StatsCard
          title="Total Students"
          value={school.total_students || 0}
          icon={Users}
          color="#06b6d4"
          trend="Registered in system"
        />
        <StatsCard
          title="Faculty Teachers"
          value={school.total_teachers || 0}
          icon={UserCheck}
          color="#10b981"
          trend="Active teaching staff"
        />
        <StatsCard
          title="Card Price"
          value={`₹${school.card_price || 50}`}
          icon={CreditCard}
          color="#f59e0b"
          trend="Per printed card"
        />
        <StatsCard
          title="Status"
          value={school.status?.toUpperCase()}
          icon={Building2}
          color={school.status === 'active' ? '#10b981' : '#f43f5e'}
          trend={`Plan: ${school.subscription_plan}`}
        />
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
        {/* Contact & Location */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            Contact & Address Details
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={18} color="var(--text-secondary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</div>
                <div style={{ color: 'var(--text-primary)' }}>{school.email || 'Not provided'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={18} color="var(--text-secondary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone</div>
                <div style={{ color: 'var(--text-primary)' }}>{school.phone || 'Not provided'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={18} color="var(--text-secondary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Address</div>
                <div style={{ color: 'var(--text-primary)' }}>
                  {school.address || 'N/A'}, {school.city || ''} {school.state || ''} {school.postal_code || ''}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Globe size={18} color="var(--text-secondary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Website</div>
                <div style={{ color: '#06b6d4' }}>{school.website || 'Not provided'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Admin Credentials */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
            School Administrator Account
          </h3>
          {school.admin_user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Username: </span>
                <strong style={{ color: '#818cf8' }}>{school.admin_user.username}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Admin Email: </span>
                <span style={{ color: 'var(--text-primary)' }}>{school.admin_user.email}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Active Status: </span>
                <span className={`badge badge-${school.admin_user.is_active ? 'active' : 'inactive'}`}>
                  {school.admin_user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => navigate(`/admin/school-security?school_id=${school.id}`)}
                >
                  Change Password for {school.admin_user.username}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                No dedicated administrator account currently linked to this school.
              </p>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: '1rem' }}
                onClick={() => navigate(`/admin/school-security?school_id=${school.id}`)}
              >
                Provision Admin Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SchoolDetails;

