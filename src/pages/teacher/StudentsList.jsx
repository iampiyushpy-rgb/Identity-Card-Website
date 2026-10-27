import React, { useState, useEffect } from 'react';
import { teacherApi } from '../../api/teacherApi';
import { Table } from '../../components/Table';
import { IDCardPreviewModal } from '../../components/IDCardPreviewModal';
import { Users, Eye, Plus, Filter, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeacherStudentsList = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [previewStudent, setPreviewStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stuRes, clsRes, secRes] = await Promise.all([
        teacherApi.getStudents(),
        teacherApi.getClasses(),
        teacherApi.getSections(),
      ]);
      setStudents(stuRes.data.results || stuRes.data);
      setClasses(clsRes.data.results || clsRes.data);
      setSections(secRes.data.results || secRes.data);
    } catch (err) {
      console.error('Failed to load students for teacher:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPrinted = async (studentId) => {
    try {
      await teacherApi.bulkStatusUpdate({
        student_ids: [studentId],
        status: 'printed',
      });
      fetchData();
    } catch (err) {
      alert('Failed to update card status');
    }
  };

  const filtered = students.filter((s) => {
    const matchesSearch =
      search === '' ||
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.admission_number?.toLowerCase().includes(search.toLowerCase()) ||
      s.roll_number?.toLowerCase().includes(search.toLowerCase());

    const matchesClass = !selectedClass || String(s.current_class) === String(selectedClass);
    const matchesSection = !selectedSection || String(s.current_section) === String(selectedSection);

    return matchesSearch && matchesClass && matchesSection;
  });

  const columns = [
    {
      header: 'Student Name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {row.photo ? (
            <img src={row.photo} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
              {row.first_name[0]}
            </div>
          )}
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.full_name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Adm: {row.admission_number}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Roll No',
      accessor: 'roll_number',
    },
    {
      header: 'Class & Section',
      render: (row) => `${row.class_name || ''} - ${row.section_name || ''}`,
    },
    {
      header: 'Blood Group',
      render: (row) => <span style={{ color: '#fb7185', fontWeight: '700' }}>{row.blood_group || 'O+'}</span>,
    },
    {
      header: 'Card Status',
      render: (row) => <span className={`badge badge-${row.id_card_status}`}>{row.id_card_status}</span>,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setPreviewStudent(row)}>
            <Eye size={14} /> ID Card
          </button>
          {row.id_card_status === 'pending' && (
            <button className="btn btn-success btn-sm" onClick={() => handleMarkPrinted(row.id)}>
              <CheckCircle size={14} /> Mark Printed
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={28} color="#4f46e5" /> Class Student Roster
          </h1>
          <p className="page-subtitle">View student details, verify information, and generate ID cards</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/teacher/add-student')}>
          <Plus size={16} /> Enroll New Student
        </button>
      </div>

      {/* Filter Row */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <Filter size={16} /> Filter by:
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          style={{ minWidth: '150px' }}
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          style={{ minWidth: '140px' }}
        >
          <option value="">All Sections</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.class_name} - {s.name}
            </option>
          ))}
        </select>

        {(selectedClass || selectedSection) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedClass('');
              setSelectedSection('');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <Table
        columns={columns}
        data={filtered}
        loading={loading}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by student name, roll number, admission..."
        emptyMessage="No students found."
      />

      {/* ID Card Live Preview Modal */}
      <IDCardPreviewModal
        isOpen={!!previewStudent}
        onClose={() => setPreviewStudent(null)}
        student={previewStudent}
      />
    </div>
  );
};
export default TeacherStudentsList;
