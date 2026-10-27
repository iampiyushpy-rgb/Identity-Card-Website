import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../api/schoolApi';
import { Table } from '../../components/Table';
import { CreditCard, Receipt, Printer, CheckCircle } from 'lucide-react';

export const SchoolPaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await schoolApi.getPayments();
      setPayments(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.receipt_number?.toLowerCase().includes(q) ||
      p.transaction_id?.toLowerCase().includes(q) ||
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
      header: 'Payment Mode',
      render: (row) => <span className="badge badge-role">{row.payment_mode}</span>,
    },
    {
      header: 'Status',
      render: (row) => <span className={`badge badge-${row.status}`}>{row.status}</span>,
    },
    {
      header: 'Description',
      accessor: 'description',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CreditCard size={28} color="#4f46e5" /> Invoices & Payment Receipts
          </h1>
          <p className="page-subtitle">View official payment transaction receipts and ID card order history</p>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredPayments}
        loading={loading}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search receipts by number or description..."
        emptyMessage="No payments or receipts recorded for your school yet."
      />
    </div>
  );
};
export default SchoolPaymentHistory;
