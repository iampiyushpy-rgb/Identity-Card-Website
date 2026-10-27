import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../api/schoolApi';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Layers, Plus, UserCheck, Calendar, Edit2, Trash2 } from 'lucide-react';

export const ClassSection = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Creation Modals
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  // Edit Modals
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [editSectionClassId, setEditSectionClassId] = useState('');
  const [editSectionName, setEditSectionName] = useState('');
  const [editSectionTeacherId, setEditSectionTeacherId] = useState('');
  const [editError, setEditError] = useState('');

  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [editClassName, setEditClassName] = useState('');

  // Forms
  const [className, setClassName] = useState('');

  const [sectionClassId, setSectionClassId] = useState('');
  const [sectionName, setSectionName] = useState('');
  const [sectionTeacherId, setSectionTeacherId] = useState('');

  const [sessionName, setSessionName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clsRes, secRes, tchRes, sesRes] = await Promise.all([
        schoolApi.getClasses(),
        schoolApi.getSections(),
        schoolApi.getTeachers(),
        schoolApi.getSessions(),
      ]);
      setClasses(clsRes.data.results || clsRes.data);
      setSections(secRes.data.results || secRes.data);
      setTeachers(tchRes.data.results || tchRes.data);
      setSessions(sesRes.data.results || sesRes.data);
    } catch (err) {
      console.error('Failed to load classes and sections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!sessionName) return;
    try {
      await schoolApi.createSession({ name: sessionName, is_active: true });
      setIsSessionModalOpen(false);
      setSessionName('');
      fetchData();
    } catch (err) {
      alert('Failed to create academic session: ' + (err.response?.data?.name?.[0] || 'Error'));
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!className) return;
    try {
      await schoolApi.createClass({ name: className });
      setIsClassModalOpen(false);
      setClassName('');
      fetchData();
    } catch (err) {
      alert('Failed to create class: ' + (err.response?.data?.name?.[0] || 'Error'));
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();
    if (!sectionClassId || !sectionName) return;
    try {
      await schoolApi.createSection({
        class_level: sectionClassId,
        name: sectionName,
        teacher: sectionTeacherId || null,
      });
      setIsSectionModalOpen(false);
      setSectionName('');
      setSectionTeacherId('');
      fetchData();
    } catch (err) {
      alert('Failed to create section: ' + (err.response?.data?.detail || 'Error'));
    }
  };

  // Section Edit Handlers
  const handleOpenEditSection = (section) => {
    setEditingSection(section);
    setEditSectionClassId(section.class_level || '');
    setEditSectionName(section.name || '');
    setEditSectionTeacherId(section.teacher || '');
    setEditError('');
    setIsEditSectionModalOpen(true);
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    if (!editingSection) return;
    try {
      setSubmitting(true);
      setEditError('');
      await schoolApi.updateSection(editingSection.id, {
        class_level: editSectionClassId,
        name: editSectionName,
        teacher: editSectionTeacherId ? editSectionTeacherId : null,
      });
      setIsEditSectionModalOpen(false);
      setEditingSection(null);
      await fetchData();
    } catch (err) {
      setEditError(err.response?.data?.detail || err.response?.data?.name?.[0] || 'Failed to update section');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSection = async (sectionId, displayName) => {
    if (!window.confirm(`Are you sure you want to delete section "${displayName}"?`)) return;
    try {
      await schoolApi.deleteSection(sectionId);
      await fetchData();
    } catch (err) {
      alert('Failed to delete section: ' + (err.response?.data?.detail || 'Cannot delete section with active students.'));
    }
  };

  // Class Edit Handlers
  const handleOpenEditClass = (c) => {
    setEditingClass(c);
    setEditClassName(c.name || '');
    setIsEditClassModalOpen(true);
  };

  const handleUpdateClass = async (e) => {
    e.preventDefault();
    if (!editingClass) return;
    try {
      setSubmitting(true);
      await schoolApi.updateClass(editingClass.id, {
        name: editClassName,
      });
      setIsEditClassModalOpen(false);
      setEditingClass(null);
      await fetchData();
    } catch (err) {
      alert('Failed to update class: ' + (err.response?.data?.detail || err.response?.data?.name?.[0] || 'Error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClass = async (classId, className) => {
    if (!window.confirm(`Are you sure you want to delete "${className}" and its sections?`)) return;
    try {
      await schoolApi.deleteClass(classId);
      await fetchData();
    } catch (err) {
      alert('Failed to delete class: ' + (err.response?.data?.detail || 'Cannot delete class with active students.'));
    }
  };

  const columns = [
    {
      header: 'Class',
      render: (row) => <strong style={{ color: 'var(--text-primary)' }}>{row.class_name}</strong>,
    },
    {
      header: 'Section',
      render: (row) => <span className="badge badge-role">{row.name}</span>,
    },
    {
      header: 'Assigned Class Teacher',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <UserCheck size={16} color={row.teacher_name ? 'var(--success)' : '#6b7280'} />
          <span style={{ color: row.teacher_name ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            {row.teacher_name || 'Unassigned'}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleOpenEditSection(row)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            title="Edit Section & Assigned Teacher"
          >
            <Edit2 size={13} /> Edit
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleDeleteSection(row.id, `${row.class_name} - ${row.name}`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--danger, #ef4444)' }}
            title="Delete Section"
          >
            <Trash2 size={13} />
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
            <Layers size={28} color="#4f46e5" /> Classes & Sections Setup
          </h1>
          <p className="page-subtitle">Configure classes, divisions, and assign class teacher responsibilities</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setIsSessionModalOpen(true)}>
            <Calendar size={16} /> Add Session
          </button>
          <button className="btn btn-secondary" onClick={() => setIsClassModalOpen(true)}>
            <Plus size={16} /> Add Class
          </button>
          <button className="btn btn-primary" onClick={() => setIsSectionModalOpen(true)}>
            <Plus size={16} /> Add Section
          </button>
        </div>
      </div>

      {/* Active Academic Sessions Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Academic Sessions:</span>
        {sessions.map((ses) => (
          <span
            key={ses.id}
            className={`badge ${ses.is_active ? 'badge-role' : ''}`}
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
          >
            {ses.name} {ses.is_active ? '• Active' : ''}
          </span>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {classes.map((c) => (
          <div key={c.id} className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem' }}>{c.name}</div>
                <button
                  type="button"
                  onClick={() => handleOpenEditClass(c)}
                  style={{ color: 'var(--text-secondary)', padding: '0.2rem', cursor: 'pointer' }}
                  title="Edit Class"
                >
                  <Edit2 size={14} />
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                {c.sections?.length || 0} Sections • {c.student_count || 0} Students
              </div>
            </div>
          </div>
        ))}
      </div>

      <Table
        columns={columns}
        data={sections}
        loading={loading}
        emptyMessage="No sections created yet. Add a class and section to get started."
      />

      {/* Edit Section Modal */}
      <Modal
        isOpen={isEditSectionModalOpen}
        onClose={() => setIsEditSectionModalOpen(false)}
        title={`Edit Section: ${editingSection?.class_name || ''} - Section ${editingSection?.name || ''}`}
        maxWidth="500px"
      >
        {editError && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose, #e11d48)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {editError}
          </div>
        )}

        <form onSubmit={handleUpdateSection}>
          <div className="form-group">
            <label className="form-label">Academic Class *</label>
            <select
              className="form-control"
              value={editSectionClassId}
              onChange={(e) => setEditSectionClassId(e.target.value)}
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
            <label className="form-label">Section Name / Division *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. A, B, or Aster"
              value={editSectionName}
              onChange={(e) => setEditSectionName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Class Teacher</label>
            <select
              className="form-control"
              value={editSectionTeacherId}
              onChange={(e) => setEditSectionTeacherId(e.target.value)}
            >
              <option value="">-- Unassigned (None) --</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.first_name} {t.last_name || ''} ({t.username || 'Teacher'})
                </option>
              ))}
            </select>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.35rem', display: 'block' }}>
              Assigning a teacher allows them to view, manage, and add students for this class and section.
            </small>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditSectionModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Section'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Class Modal */}
      <Modal
        isOpen={isEditClassModalOpen}
        onClose={() => setIsEditClassModalOpen(false)}
        title={`Edit Academic Class: ${editingClass?.name || ''}`}
        maxWidth="450px"
      >
        <form onSubmit={handleUpdateClass}>
          <div className="form-group">
            <label className="form-label">Class Name *</label>
            <input
              type="text"
              className="form-control"
              value={editClassName}
              onChange={(e) => setEditClassName(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', background: 'transparent', display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                setIsEditClassModalOpen(false);
                handleDeleteClass(editingClass?.id, editingClass?.name);
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditClassModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Add Class Modal */}
      <Modal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        title="Add New Academic Class"
        maxWidth="450px"
      >
        <form onSubmit={handleCreateClass}>
          <div className="form-group">
            <label className="form-label">Class Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Class 10 or Class 8"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsClassModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Class
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Section Modal */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title="Add Section to Class"
        maxWidth="480px"
      >
        <form onSubmit={handleCreateSection}>
          <div className="form-group">
            <label className="form-label">Class *</label>
            <select
              className="form-control"
              value={sectionClassId}
              onChange={(e) => setSectionClassId(e.target.value)}
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
            <label className="form-label">Section Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. A, B, or Aster"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assign Class Teacher</label>
            <select
              className="form-control"
              value={sectionTeacherId}
              onChange={(e) => setSectionTeacherId(e.target.value)}
            >
              <option value="">None / Assign Later</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.first_name} {t.last_name || ''} ({t.username || 'Teacher'})
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsSectionModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Section
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Session Modal */}
      <Modal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        title="Add Academic Session"
        maxWidth="420px"
      >
        <form onSubmit={handleCreateSession}>
          <div className="form-group">
            <label className="form-label">Session Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 2026-2027"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsSessionModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Session
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default ClassSection;
