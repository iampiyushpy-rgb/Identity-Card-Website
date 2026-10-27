import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../api/schoolApi';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { UserCheck, Plus, KeyRound, CheckCircle2, AlertCircle, Phone, Edit2 } from 'lucide-react';

export const TeacherProfiles = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add Teacher Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    designation: 'Faculty Teacher',
    qualification: '',
    phone: '',
    password: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit Teacher Modal
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    designation: '',
    qualification: '',
    phone: '',
  });
  const [editFormError, setEditFormError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Password Reset Modal
  const [resetTeacher, setResetTeacher] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await schoolApi.getTeachers();
      setTeachers(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to load teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        password: formData.password.trim() || 'teacher123',
      };
      await schoolApi.createTeacher(payload);
      setIsAddModalOpen(false);
      setFormData({
        first_name: '',
        last_name: '',
        designation: 'Faculty Teacher',
        qualification: '',
        phone: '',
        password: '',
      });
      fetchTeachers();
    } catch (err) {
      const errData = err.response?.data || {};
      const msg =
        errData.first_name?.[0] ||
        errData.password?.[0] ||
        errData.phone?.[0] ||
        errData.detail ||
        errData.error ||
        'Error creating teacher profile.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditModal = (teacher) => {
    setEditingTeacher(teacher);
    setEditFormData({
      first_name: teacher.first_name || '',
      last_name: teacher.last_name || '',
      designation: teacher.designation || 'Faculty Teacher',
      qualification: teacher.qualification || '',
      phone: teacher.phone || '',
    });
    setEditFormError('');
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    if (!editingTeacher) return;
    setEditFormError('');
    setUpdating(true);
    try {
      await schoolApi.updateTeacher(editingTeacher.id, editFormData);
      setEditingTeacher(null);
      fetchTeachers();
    } catch (err) {
      const errData = err.response?.data || {};
      const msg =
        errData.first_name?.[0] ||
        errData.phone?.[0] ||
        errData.detail ||
        errData.error ||
        'Error updating teacher profile.';
      setEditFormError(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetTeacher || !newPassword) return;
    try {
      const res = await schoolApi.resetTeacherPassword(resetTeacher.id, newPassword);
      setResetMessage(res.data.message);
      setNewPassword('');
    } catch (err) {
      alert('Password reset failed.');
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.first_name?.toLowerCase().includes(q) ||
      t.last_name?.toLowerCase().includes(q) ||
      t.username?.toLowerCase().includes(q) ||
      t.designation?.toLowerCase().includes(q) ||
      t.phone?.toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      header: 'Faculty Name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
            {row.first_name} {row.last_name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            User: <strong style={{ color: '#06b6d4' }}>{row.username}</strong>
          </div>
        </div>
      ),
    },
    {
      header: 'Designation & Qualification',
      render: (row) => (
        <div>
          <div>{row.designation || 'Faculty Teacher'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{row.qualification || 'N/A'}</div>
        </div>
      ),
    },
    {
      header: 'Contact Phone',
      render: (row) => (
        <div style={{ fontSize: '0.85rem' }}>
          <div>{row.phone || <span style={{ color: 'var(--text-muted)' }}>No phone</span>}</div>
        </div>
      ),
    },
    {
      header: 'Assigned Sections',
      render: (row) => (
        <div>
          {row.assigned_sections?.length > 0 ? (
            row.assigned_sections.map((s) => (
              <span key={s.id} className="badge badge-role" style={{ marginRight: '0.35rem' }}>
                {s.class_name} - {s.name}
              </span>
            ))
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None</span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleOpenEditModal(row)}
            title="Edit Teacher Profile"
          >
            <Edit2 size={14} /> Edit
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setResetTeacher(row);
              setResetMessage('');
              setNewPassword('');
            }}
            title="Reset Password"
          >
            <KeyRound size={14} /> Password
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
            <UserCheck size={28} color="#4f46e5" /> Faculty & Teacher Profiles
          </h1>
          <p className="page-subtitle">Manage faculty staff members, teacher login credentials, and assigned classes</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} /> Add New Teacher
        </button>
      </div>

      <Table
        columns={columns}
        data={filteredTeachers}
        loading={loading}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by teacher name, username, or phone..."
        emptyMessage="No teachers added yet."
      />

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Faculty Teacher"
        maxWidth="540px"
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

        <form onSubmit={handleCreateTeacher}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Sarah"
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
                placeholder="e.g. Jenkins"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Senior Faculty"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Qualification / Subject</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. M.Sc Mathematics"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
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
            <div className="form-group">
              <label className="form-label">Initial Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Default: teacher123"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Teacher'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Teacher Modal */}
      <Modal
        isOpen={!!editingTeacher}
        onClose={() => setEditingTeacher(null)}
        title={`Edit Faculty Profile: ${editingTeacher?.first_name || ''} ${editingTeacher?.last_name || ''}`}
        maxWidth="540px"
      >
        {editFormError && (
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
            <span>{editFormError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateTeacher}>
          <div style={{ marginBottom: '1rem', padding: '0.5rem 0.75rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>Linked Username:</span>
            <code style={{ color: '#06b6d4', fontWeight: '700' }}>@{editingTeacher?.username}</code>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-control"
                value={editFormData.first_name}
                onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={editFormData.last_name}
                onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input
                type="text"
                className="form-control"
                value={editFormData.designation}
                onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Qualification / Subject</label>
              <input
                type="text"
                className="form-control"
                value={editFormData.qualification}
                onChange={(e) => setEditFormData({ ...editFormData, qualification: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone</label>
            <input
              type="text"
              className="form-control"
              placeholder="+91 98765 43210"
              value={editFormData.phone}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
            />
          </div>

          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', background: 'transparent' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingTeacher(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Password Reset Modal */}
      <Modal
        isOpen={!!resetTeacher}
        onClose={() => setResetTeacher(null)}
        title={`Reset Password for ${resetTeacher?.first_name} ${resetTeacher?.last_name || ''}`}
        maxWidth="460px"
      >
        {resetMessage ? (
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-md)', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle2 size={18} />
            <div>
              <div style={{ fontWeight: '600' }}>Password Updated!</div>
              <div style={{ fontSize: '0.85rem' }}>{resetMessage}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label">New Password *</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', background: 'transparent' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setResetTeacher(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default TeacherProfiles;
