import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { StatsCard } from '../../components/StatsCard';
import { Table } from '../../components/Table';
import { Building2, CreditCard, Plus, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_schools: 0,
    active_schools: 0,
    total_students: 0,
    total_teachers: 0,
    total_revenue: 0,
    recent_schools: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const schoolColumns = [
    {
      header: 'School Name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Principal: {row.principal_name || 'Not assigned'}</div>
        </div>
      ),
    },
    {
      header: 'City & State',
      render: (row) => `${row.city || 'N/A'}, ${row.state || ''}`,
    },
    {
      header: 'Plan',
      render: (row) => (
        <span className="badge badge-role">
          {row.subscription_plan}
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span className={`badge badge-${row.status}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/admin/schools/${row.id}`)}
        >
          View Details <ArrowUpRight size={14} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Building2 size={28} color="#4f46e5" /> Super Admin Overview
          </h1>
          <p className="page-subtitle">Platform-wide statistics, active tenant schools, and revenue</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/admin/schools?add=true')}>
            <Plus size={16} /> Register School
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Schools"
          value={stats.total_schools}
          icon={Building2}
          color="#4f46e5"
          trend={`${stats.active_schools} Active Institutions`}
        />
        <StatsCard
          title="Platform Revenue"
          value={`₹${stats.total_revenue.toLocaleString('en-IN')}`}
          icon={CreditCard}
          color="#10b981"
          trend="Completed payments"
        />
      </div>

      {/* Recent Schools Section */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Recently Registered Schools</h2>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/schools')}>
            View All Schools
          </button>
        </div>
        <Table
          columns={schoolColumns}
          data={stats.recent_schools || []}
          loading={loading}
          emptyMessage="No schools registered yet."
        />
      </div>
    </div>
  );
};
export default AdminDashboard;
