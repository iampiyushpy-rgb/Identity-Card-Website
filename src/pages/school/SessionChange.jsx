import React, { useState, useEffect } from 'react';
import { schoolApi } from '../../api/schoolApi';
import { Table } from '../../components/Table';
import { RefreshCw, ArrowRight, CheckCircle2, AlertCircle, Users } from 'lucide-react';

export const SessionChange = () => {
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  // Selection
  const [sourceSession, setSourceSession] = useState('');
  const [sourceClass, setSourceClass] = useState('');
  const [targetSession, setTargetSession] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [targetSection, setTargetSection] = useState('');

  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      const [sesRes, clsRes, secRes, stuRes] = await Promise.all([
        schoolApi.getSessions(),
        schoolApi.getClasses(),
        schoolApi.getSections(),
        schoolApi.getStudents(),
      ]);
      const sesList = sesRes.data.results || sesRes.data;
      const clsList = clsRes.data.results || clsRes.data;
      setSessions(sesList);
      setClasses(clsList);
      setSections(secRes.data.results || secRes.data);
      setAllStudents(stuRes.data.results || stuRes.data);

      const activeSes = sesList.find((s) => s.is_active);
      if (activeSes) setSourceSession(activeSes.id);
      if (clsList.length > 0) setSourceClass(clsList[0].id);
    } catch (err) {
      console.error('Failed to load session rollover metadata:', err);
    } finally {
      setLoading(false);
    }
  };

  // Eligible students in source session and class
  const eligibleStudents = allStudents.filter((s) => {
    const matchSession = !sourceSession || String(s.current_session) === String(sourceSession);
    const matchClass = !sourceClass || String(s.current_class) === String(sourceClass);
    return matchSession && matchClass;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudentIds(eligibleStudents.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggle = (id) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter((sid) => sid !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const handlePromote = async (e) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) {
      alert('Please select at least one student to promote.');
      return;
    }
    if (!targetSession || !targetClass || !targetSection) {
      alert('Please specify target session, class, and section.');
      return;
    }

    setSubmitting(true);
    setResultMessage('');
    try {
      const res = await schoolApi.changeSession({
        student_ids: selectedStudentIds,
        target_session_id: Number(targetSession),
        target_class_id: Number(targetClass),
        target_section_id: Number(targetSection),
      });
      setResultMessage(res.data.message);
      setSelectedStudentIds([]);
      // Refresh students
      const stuRes = await schoolApi.getStudents();
      setAllStudents(stuRes.data.results || stuRes.data);
    } catch (err) {
      alert('Session promotion failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedStudentIds.length === eligibleStudents.length && eligibleStudents.length > 0}
          onChange={handleSelectAll}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedStudentIds.includes(row.id)}
          onChange={() => handleToggle(row.id)}
        />
      ),
    },
    {
      header: 'Student Name',
      render: (row) => <strong style={{ color: 'var(--text-primary)' }}>{row.full_name}</strong>,
    },
    {
      header: 'Admission No',
      accessor: 'admission_number',
    },
    {
      header: 'Current Class & Section',
      render: (row) => `${row.class_name} - ${row.section_name}`,
    },
    {
      header: 'Roll No',
      accessor: 'roll_number',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <RefreshCw size={28} color="#4f46e5" /> Academic Session Rollover & Promotion
          </h1>
          <p className="page-subtitle">Batch promote or transfer students into a new academic year and updated class grades</p>
        </div>
      </div>

      {resultMessage && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <CheckCircle2 size={20} />
          <div>
            <div style={{ fontWeight: '700' }}>Rollover Completed</div>
            <div style={{ fontSize: '0.875rem' }}>{resultMessage}</div>
          </div>
        </div>
      )}

      {/* Two Column Layout for Active Session & Session List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Source Filter */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            1. Select Source Cohort
          </h3>
          <div className="form-group">
            <label className="form-label">Source Session</label>
            <select
              className="form-control"
              value={sourceSession}
              onChange={(e) => setSourceSession(e.target.value)}
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.is_active ? '(Active)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Source Class Grade</label>
            <select
              className="form-control"
              value={sourceClass}
              onChange={(e) => setSourceClass(e.target.value)}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Destination */}
        <div className="glass-card" style={{ border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#818cf8', marginBottom: '1rem' }}>
            2. Choose Target Destination
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Target Session *</label>
              <select
                className="form-control"
                value={targetSession}
                onChange={(e) => setTargetSession(e.target.value)}
                required
              >
                <option value="">Select Target...</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target Class *</label>
              <select
                className="form-control"
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
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
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Target Section *</label>
            <select
              className="form-control"
              value={targetSection}
              onChange={(e) => setTargetSection(e.target.value)}
              required
            >
              <option value="">Select Section...</option>
              {sections
                .filter((sec) => !targetClass || String(sec.class_level) === String(targetClass))
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.class_name} - {s.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Student Selection Table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)' }}>
          Select Students to Promote ({selectedStudentIds.length} of {eligibleStudents.length} selected)
        </h2>
        <button
          className="btn btn-primary"
          onClick={handlePromote}
          disabled={submitting || selectedStudentIds.length === 0}
        >
          <ArrowRight size={16} /> {submitting ? 'Promoting...' : `Promote (${selectedStudentIds.length}) Students`}
        </button>
      </div>

      <Table
        columns={columns}
        data={eligibleStudents}
        loading={loading}
        emptyMessage="No students found in selected source session and class."
      />
    </div>
  );
};
export default SessionChange;

