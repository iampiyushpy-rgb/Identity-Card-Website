import React, { useState, useEffect } from 'react';
import { teacherApi } from '../../api/teacherApi';
import { UserPlus, ArrowLeft, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddStudent = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [sessions, setSessions] = useState([]);

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
  const [photoPreview, setPhotoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAcademics();
  }, []);

  const fetchAcademics = async () => {
    try {
      const [clsRes, secRes, sesRes] = await Promise.all([
        teacherApi.getClasses(),
        teacherApi.getSections(),
        teacherApi.getSessions(),
      ]);
      const clsList = clsRes?.data?.results || clsRes?.data || [];
      const secList = secRes?.data?.results || secRes?.data || [];
      const sesList = sesRes?.data?.results || sesRes?.data || [];

      const safeCls = Array.isArray(clsList) ? clsList : [];
      const safeSec = Array.isArray(secList) ? secList : [];
      const safeSes = Array.isArray(sesList) ? sesList : [];

      setClasses(safeCls);
      setSections(safeSec);
      setSessions(safeSes);

      const activeSes = safeSes.find((s) => s.is_active) || safeSes[0];
      if (activeSes) setFormData((prev) => ({ ...prev, current_session: activeSes.id }));
      if (safeCls.length > 0) {
        const defaultClassId = safeCls[0].id;
        const matchingSec = safeSec.find((sec) => String(sec.class_level) === String(defaultClassId));
        setFormData((prev) => ({
          ...prev,
          current_class: defaultClassId,
          current_section: matchingSec ? matchingSec.id : (safeSec[0]?.id || ''),
        }));
      }
    } catch (err) {
      console.error('Failed to load classes for teacher admission:', err);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Photo size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.emergency_contact && formData.emergency_contact.length < 10) {
      setError('Please enter a valid 10-digit emergency contact phone number.');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) data.append(key, val);
      });
      if (photoFile) data.append('photo', photoFile);

      await teacherApi.createStudent(data);
      setSuccess('Student enrolled successfully! ID card is queued for generation.');
      setTimeout(() => {
        navigate('/teacher/students');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.admission_number?.[0] ||
        err.response?.data?.current_section?.[0] ||
        err.response?.data?.detail ||
        'Error admitting student. Please verify admission number is unique.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/teacher/students')}>
          <ArrowLeft size={16} /> Back to Students
        </button>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">
            <UserPlus size={28} color="#4f46e5" /> Enroll Student
          </h1>
          <p className="page-subtitle">Add a new student admission record with photo and emergency contact</p>
        </div>
      </div>

      <div className="glass-card">
        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle2 size={18} /> {success}
          </div>
        )}
        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="First name"
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
                placeholder="Last name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Admission Number *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. ADM-2025-501"
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
                placeholder="e.g. 15"
                value={formData.roll_number}
                onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Class *</label>
              <select
                className="form-control"
                value={formData.current_class}
                onChange={(e) => {
                  const newClassId = e.target.value;
                  const matchingSec = sections.find((sec) => String(sec.class_level) === String(newClassId));
                  setFormData({
                    ...formData,
                    current_class: newClassId,
                    current_section: matchingSec ? matchingSec.id : '',
                  });
                }}
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
                value={formData.father_name}
                onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency Contact Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="10-digit mobile number"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              className="form-control"
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Student Photo (Portrait for ID Card)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.5rem' }}>
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Student Preview"
                  style={{
                    width: '72px',
                    height: '88px',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-sm)',
                    border: '2px solid var(--border-color)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '72px',
                    height: '88px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-card)',
                    border: '1px dashed var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Upload size={20} />
                  <span style={{ fontSize: '0.65rem', marginTop: '0.25rem' }}>No Photo</span>
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handlePhotoChange}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Supported formats: JPG, PNG, WEBP. Max size: 5MB.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/teacher/students')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Admitting Student...' : 'Admit & Generate ID Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddStudent;
