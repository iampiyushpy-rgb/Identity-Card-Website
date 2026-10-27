import React, { useState, useEffect } from 'react';
import { teacherApi } from '../../api/teacherApi';
import { useAuth } from '../../context/AuthContext';
import { StatsCard } from '../../components/StatsCard';
import { Table } from '../../components/Table';
import { IDCardPreviewModal } from '../../components/IDCardPreviewModal';
import { Users, BookOpen, UserPlus, IdCard, Eye, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewStudent, setPreviewStudent] = useState(null);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const [profRes, stuRes] = await Promise.all([
        teacherApi.getProfile(),
        teacherApi.getStudents(),
      ]);
      setProfile(profRes.data);
      setStudents(stuRes.data.results || stuRes.data);
    } catch (err) {
      console.error('Failed to load teacher dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const mySections = profile?.assigned_sections || [];
  const totalStudents = students.length;
  const pendingCards = students.filter((s) => s.id_card_status === 'pending').length;

  const columns = [
    {
      header: 'Student Name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.full_name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Roll No: {row.roll_number || 'N/A'}</div>
        </div>
      ),
    },
    {
      header: 'Admission No',
      accessor: 'admission_number',
    },
    {
      header: 'Class & Section',
      render: (row) => `${row.class_name || ''} - ${row.section_name || ''}`,
    },
    {
      header: 'Card Status',
      render: (row) => <span className={`badge badge-${row.id_card_status}`}>{row.id_card_status}</span>,
    },
    {
      header: 'Action',
      render: (row) => (
        <button className="btn btn-secondary btn-sm" onClick={() => setPreviewStudent(row)}>
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
            <BookOpen size={28} color="#4f46e5" /> Faculty Portal: {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
          </h1>
          <p className="page-subtitle">
            {profile?.designation || 'Teacher'} • {user?.school_name || 'School Faculty'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={() => navigate('/teacher/add-student')}>
            <UserPlus size={16} /> Enroll Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Assigned Sections"
          value={mySections.length}
          icon={Layers}
          color="#4f46e5"
          trend={mySections.map((s) => `${s.class_name}-${s.name}`).join(', ') || 'No sections assigned'}
        />
        <StatsCard
          title="Students in Care"
          value={totalStudents}
          icon={Users}
          color="#06b6d4"
          trend="Enrolled students"
        />
        <StatsCard
          title="Pending ID Cards"
          value={pendingCards}
          icon={IdCard}
          color="#f59e0b"
          trend="Cards to be printed"
        />
        <StatsCard
          title="Academic Session"
          value="2025-2026"
          icon={BookOpen}
          color="#10b981"
          trend="Current Active Term"
        />
      </div>

      {/* Recent Students */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Class Students Overview</h2>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/teacher/students')}>
            View Full Roster
          </button>
        </div>

        <Table
          columns={columns}
          data={students.slice(0, 6)}
          loading={loading}
          emptyMessage="No students assigned to your classes yet."
        />
      </div>

      {/* Preview Modal */}
      <IDCardPreviewModal
        isOpen={!!previewStudent}
        onClose={() => setPreviewStudent(null)}
        student={previewStudent}
      />
    </div>
  );
};
export default TeacherDashboard;
