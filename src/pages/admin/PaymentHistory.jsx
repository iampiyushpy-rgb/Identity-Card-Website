import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { CreditCard, Plus, CheckCircle, Receipt, ArrowDownRight, Filter } from 'lucide-react';

export const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    school: '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_mode: 'Bank Transfer',
    status: 'completed',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPayments();
    fetchSchools();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPayments();
      setPayments(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await adminApi.getSchools();
      setSchools(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to load schools for payment:', err);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!formData.school || !formData.amount) return;
    setSubmitting(true);
    try {
      await adminApi.recordPayment(formData);
      setIsRecordModalOpen(false);
      setFormData({
        school: '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_mode: 'Bank Transfer',
        status: 'completed',
        description: '',
      });
      fetchPayments();
    } catch (err) {
      alert('Failed to record payment: ' + (err.response?.data?.detail || 'Error'));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.receipt_number?.toLowerCase().includes(q) ||
      p.transaction_id?.toLowerCase().includes(q) ||
      p.school_name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      header: 'Receipt No',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Receipt size={16} color="#06b6d4" />
          <strong style={{ color: 'var(--text-primary)' }}>{row.receipt_number}</strong>
        </div>
      ),
    },
    {
      header: 'School',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.school_name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Code: {row.school_code}</div>
        </div>
      ),
    },
    {
      header: 'Amount',
      render: (row) => (
        <span style={{ fontWeight: '700', fontSize: '1rem', color: '#10b981' }}>
          ₹{Number(row.amount).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: 'payment_date',
    },
    {
      header: 'Mode',
      render: (row) => <span className="badge badge-role">{row.payment_mode}</span>,
    },
    {
      header: 'Status',
      render: (row) => <span className={`badge badge-${row.status}`}>{row.status}</span>,
    },
    {
      header: 'Txn Ref',
      render: (row) => (
        <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
          {row.transaction_id}
        </code>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CreditCard size={28} color="#4f46e5" /> Platform Payment History
          </h1>
          <p className="page-subtitle">Track institutional billing, subscription payments, and print receipts</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsRecordModalOpen(true)}>
          <Plus size={16} /> Record Payment
        </button>
      </div>

      <Table
        columns={columns}
        data={filteredPayments}
        loading={loading}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by receipt, transaction ID, or school..."
        emptyMessage="No payment records found."
      />

      {/* Record Payment Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record New Payment / Receipt"
        maxWidth="540px"
      >
        <form onSubmit={handleRecordPayment}>
          <div className="form-group">
            <label className="form-label">School *</label>
            <select
              className="form-control"
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              required
            >
              <option value="">Select Institution...</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="e.g. 15000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Mode</label>
              <select
                className="form-control"
                value={formData.payment_mode}
                onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
              >
                <option value="Bank Transfer">Bank Transfer (NEFT/IMPS/RTGS)</option>
                <option value="Card">Debit / Credit Card</option>
                <option value="Cheque">Demand Draft / Cheque</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending Verification</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Remarks</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="e.g. ID card batch printing for 2025-26 session"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsRecordModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Recording...' : 'Save Payment Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default PaymentHistory;
