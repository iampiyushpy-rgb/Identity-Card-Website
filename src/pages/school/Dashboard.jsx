import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../api/schoolApi';
import { useAuth } from '../../context/AuthContext';
import { StatsCard } from '../../components/StatsCard';
import { Table } from '../../components/Table';
import { IDCardPreviewModal } from '../../components/IDCardPreviewModal';
import { GraduationCap, Layers, UserCheck, IdCard, Plus, Eye, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SchoolDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewStudent, setPreviewStudent] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [stuRes, clsRes, tchRes] = await Promise.all([
        schoolApi.getStudents(),
        schoolApi.getClasses(),
        schoolApi.getTeachers(),
      ]);
      setStudents(stuRes.data.results || stuRes.data);
      setClasses(clsRes.data.results || clsRes.data);
      setTeachers(tchRes.data.results || tchRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalStudents = students.length;
  const pendingCards = students.filter((s) => s.id_card_status === 'pending').length;
  const printedCards = students.filter((s) => s.id_card_status === 'printed' || s.id_card_status === 'delivered').length;

  const studentColumns = [
    {
      header: 'Student',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.full_name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Adm: {row.admission_number}</div>
        </div>
      ),
    },
    {
      header: 'Class & Section',
      render: (row) => `${row.class_name || 'N/A'} - ${row.section_name || ''}`,
    },
    {
      header: 'Roll No',
      accessor: 'roll_number',
    },
    {
      header: 'Card Status',
      render: (row) => <span className={`badge badge-${row.id_card_status}`}>{row.id_card_status}</span>,
    },
    {
      header: 'Card Action',
      render: (row) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setPreviewStudent(row)}
        >
          <Eye size={14} /> Preview Card
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <GraduationCap size={28} color="#4f46e5" /> School Portal: {user?.school_name || 'Academic Console'}
          </h1>
          <p className="page-subtitle">Manage admissions, ID card generation, classes, and teaching staff</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/school/students?add=true')}>
            <Plus size={16} /> Enroll Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Students"
          value={totalStudents}
          icon={GraduationCap}
          color="#4f46e5"
          trend="Active enrolled students"
        />
        <StatsCard
          title="Pending ID Cards"
          value={pendingCards}
          icon={IdCard}
          color="#f59e0b"
          trend="Awaiting generation / print"
        />
        <StatsCard
          title="Printed / Delivered"
          value={printedCards}
          icon={CheckCircle}
          color="#10b981"
          trend="Cards successfully printed"
        />
        <StatsCard
          title="Teaching Staff"
          value={teachers.length}
          icon={UserCheck}
          color="#06b6d4"
          trend={`${classes.length} Academic classes`}
        />
      </div>

      {/* Recent Enrolled Students */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Recent Student Admissions</h2>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/school/students')}>
            View All Students
          </button>
        </div>

        <Table
          columns={studentColumns}
          data={students.slice(0, 5)}
          loading={loading}
          emptyMessage="No students enrolled yet."
        />
      </div>

      {/* ID Card Preview Modal */}
      <IDCardPreviewModal
        isOpen={!!previewStudent}
        onClose={() => setPreviewStudent(null)}
        student={previewStudent}
      />
    </div>
  );
};
export default SchoolDashboard;

