import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../api/schoolApi';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { IDCardPreviewModal } from '../../components/IDCardPreviewModal';
import {
  GraduationCap,
  Plus,
  Eye,
  Trash2,
  Edit2,
  CheckCircle,
  Filter,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewStudent, setPreviewStudent] = useState(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const [searchParams] = useSearchParams();

  // Form State
  const [formData, setFormData] = useState({
    admission_number: '',
    roll_number: '',
    first_name: '',
    last_name: '',
    gender: 'Male',
    dob: '',
    blood_group: 'O+',
    father_name: '',
    mother_name: '',
    emergency_contact: '',
    address: '',
    current_session: '',
    current_class: '',
    current_section: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchInitialData();
    if (searchParams.get('add') === 'true') {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [stuRes, clsRes, secRes, sesRes] = await Promise.all([
        schoolApi.getStudents(),
        schoolApi.getClasses(),
        schoolApi.getSections(),
        schoolApi.getSessions(),
      ]);
      setStudents(stuRes.data.results || stuRes.data);
      setClasses(clsRes.data.results || clsRes.data);
      setSections(secRes.data.results || secRes.data);
      setSessions(sesRes.data.results || sesRes.data);

      const activeSes = (sesRes.data.results || sesRes.data).find((s) => s.is_active);
      if (activeSes) {
        setFormData((prev) => ({ ...prev, current_session: activeSes.id }));
      }
    } catch (err) {
      console.error('Failed to load students data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) data.append(key, val);
      });
      if (photoFile) {
        data.append('photo', photoFile);
      }

      await schoolApi.createStudent(data);
      setIsAddModalOpen(false);
      setPhotoFile(null);
      setFormData({
        admission_number: '',
        roll_number: '',
        first_name: '',
        last_name: '',
        gender: 'Male',
        dob: '',
        blood_group: 'O+',
        father_name: '',
        mother_name: '',
        emergency_contact: '',
        address: '',
        current_session: sessions.find((s) => s.is_active)?.id || '',
        current_class: '',
        current_section: '',
      });
      fetchInitialData();
    } catch (err) {
      setFormError(
        err.response?.data?.admission_number?.[0] ||
        err.response?.data?.detail ||
        'Error adding student. Ensure Admission Number is unique.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await schoolApi.deleteStudent(id);
      setStudents(students.filter((s) => s.id !== id));
    } catch (err) {
      alert('Failed to delete student.');
    }
  };

  const handleBulkStatus = async (status) => {
    if (selectedStudentIds.length === 0) {
      alert('Please select at least one student.');
      return;
    }
    try {
      await schoolApi.bulkStatusUpdate({
        student_ids: selectedStudentIds,
        status,
      });
      setSelectedStudentIds([]);
      fetchInitialData();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const toggleSelectStudent = (id) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((sid) => sid !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      search === '' ||
      s.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.admission_number?.toLowerCase().includes(search.toLowerCase()) ||
      s.roll_number?.toLowerCase().includes(search.toLowerCase());

    const matchesClass = !selectedClass || String(s.current_class) === String(selectedClass);
    const matchesSection = !selectedSection || String(s.current_section) === String(selectedSection);
    const matchesStatus = !selectedStatus || s.id_card_status === selectedStatus;

    return matchesSearch && matchesClass && matchesSection && matchesStatus;
  });

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedStudentIds(filteredStudents.map((s) => s.id));
            } else {
              setSelectedStudentIds([]);
            }
          }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedStudentIds.includes(row.id)}
          onChange={() => toggleSelectStudent(row.id)}
        />
      ),
    },
    {
      header: 'Student Info',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {row.photo ? (
            <img
              src={row.photo}
              alt=""
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(79, 70, 229, 0.2)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
              }}
            >
              {row.first_name[0]}
            </div>
          )}
          <div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{row.full_name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Adm: {row.admission_number} • Roll: {row.roll_number || 'N/A'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Class & Sec',
      render: (row) => `${row.class_name || 'N/A'} - ${row.section_name || ''}`,
    },
    {
      header: 'Blood Group',
      render: (row) => (
        <span style={{ fontWeight: '700', color: '#fb7185' }}>{row.blood_group || 'O+'}</span>
      ),
    },
    {
      header: 'Card Status',
      render: (row) => <span className={`badge badge-${row.id_card_status}`}>{row.id_card_status}</span>,
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setPreviewStudent(row)}
            title="Generate / Print ID Card"
          >
            <Eye size={14} /> ID Card
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDeleteStudent(row.id)}
            title="Delete Student"
          >
            <Trash2 size={14} />
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
            <GraduationCap size={28} color="#4f46e5" /> Student Roster & ID Card Generation
          </h1>
          <p className="page-subtitle">Manage student enrollments, photos, credentials, and print ID cards</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {selectedStudentIds.length > 0 && (
            <>
              <button className="btn btn-success" onClick={() => handleBulkStatus('printed')}>
                <CheckCircle size={16} /> Mark Printed ({selectedStudentIds.length})
              </button>
              <button className="btn btn-secondary" onClick={() => handleBulkStatus('delivered')}>
                Mark Delivered
              </button>
            </>
          )}
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} /> Enroll New Student
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div
        className="glass-card"
        style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <Filter size={16} /> Filters:
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

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ minWidth: '140px' }}
        >
          <option value="">All Card Statuses</option>
          <option value="pending">Pending</option>
          <option value="printed">Printed</option>
          <option value="delivered">Delivered</option>
        </select>

        {(selectedClass || selectedSection || selectedStatus) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedClass('');
              setSelectedSection('');
              setSelectedStatus('');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      <Table
        columns={columns}
        data={filteredStudents}
        loading={loading}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by student name, admission no, or roll no..."
        emptyMessage="No students found matching current filters."
      />

      {/* ID Card Live Preview Modal */}
      <IDCardPreviewModal
        isOpen={!!previewStudent}
        onClose={() => setPreviewStudent(null)}
        student={previewStudent}
      />

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll New Student"
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

        <form onSubmit={handleCreateStudent}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Aarav"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Sharma"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Admission Number (Unique) *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. ADM-2025-101"
                value={formData.admission_number}
                onChange={(e) => setFormData({ ...formData, admission_number: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 101"
                value={formData.roll_number}
                onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Academic Session *</label>
              <select
                className="form-control"
                value={formData.current_session}
                onChange={(e) => setFormData({ ...formData, current_session: e.target.value })}
                required
              >
                <option value="">Select Session...</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.is_active ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Class *</label>
              <select
                className="form-control"
                value={formData.current_class}
                onChange={(e) => setFormData({ ...formData, current_class: e.target.value })}
                required
              >
                <option value="">Select Class...</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Section *</label>
              <select
                className="form-control"
                value={formData.current_section}
                onChange={(e) => setFormData({ ...formData, current_section: e.target.value })}
                required
              >
                <option value="">Select Section...</option>
                {sections
                  .filter((sec) => !formData.current_class || String(sec.class_level) === String(formData.current_class))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.class_name} - {s.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-control"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-control"
                value={formData.blood_group}
                onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Father / Guardian Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Guardian name"
                value={formData.father_name}
                onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency Contact Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="+91 98765 43210"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Full home address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Student Photo (For ID Card)</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setPhotoFile(e.target.files[0])}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default Students;

