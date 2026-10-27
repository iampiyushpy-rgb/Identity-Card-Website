import React from 'react';
import { Modal } from './Modal';
import { Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const IDCardPreviewModal = ({ isOpen, onClose, student, school }) => {
  const { user } = useAuth();
  if (!student) return null;

  const schoolName = student.school_name || school?.name || user?.school_name || "Academic Institution";
  const sessionName = student.session_name || "Current Term";
  const className = student.class_name || "Class";
  const sectionName = student.section_name || "-";

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Student ID Card - TechRavisha"
      maxWidth="500px"
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print ID Card
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem 0' }}>
        {/* Lanyard & Metallic Clip */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '-10px', zIndex: 15 }}>
          <div className="lanyard-strap" style={{ height: '60px', width: '28px' }}></div>
          <div className="metallic-clip" style={{ width: '38px', height: '22px' }}>
            <div className="metallic-clip-pin"></div>
          </div>
        </div>

        <div className="printable-area">
          <div className="id-card-preview" style={{ border: '2px solid #cbd5e1', boxShadow: '0 20px 45px rgba(0,0,0,0.45)' }}>
            {/* Badge Punch Slot */}
            <div className="badge-punch-slot" style={{ marginTop: '0.6rem', marginBottom: '0.4rem', height: '8px', width: '45px' }}></div>

            {/* Header / School Branding */}
            <div
              className="id-card-header"
              style={{
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
                paddingTop: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem', padding: '0 0.5rem' }}>
                <span style={{ fontSize: '0.6rem', background: 'rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '10px' }}>
                  SESSION {sessionName}
                </span>
                <div className="hologram-seal" style={{ width: '20px', height: '20px', fontSize: '0.45rem' }}>
                  TR
                </div>
              </div>
              <div className="id-card-school-name">{schoolName}</div>
              <div className="id-card-school-sub">Recognized Institution • Student Identity Pass</div>
            </div>

            {/* Photo Avatar */}
            <div className="id-card-photo-container">
              {student.photo ? (
                <img src={student.photo} alt={student.full_name} className="id-card-photo" />
              ) : (
                <div
                  className="id-card-photo"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#4f46e5',
                    background: '#e0e7ff',
                  }}
                >
                  {student.first_name ? student.first_name[0] : 'S'}
                </div>
              )}
            </div>

            {/* Student Info */}
            <div className="id-card-student-name">{student.full_name || `${student.first_name} ${student.last_name || ''}`}</div>
            <div className="id-card-student-tag" style={{ color: '#4f46e5' }}>
              {className} - Section {sectionName}
            </div>

            {/* Attributes Grid */}
            <div className="id-card-details">
              <div className="id-card-row">
                <span className="id-card-label">Admission No:</span>
                <span className="id-card-val">{student.admission_number}</span>
              </div>
              <div className="id-card-row">
                <span className="id-card-label">Roll Number:</span>
                <span className="id-card-val">{student.roll_number || 'N/A'}</span>
              </div>
              <div className="id-card-row">
                <span className="id-card-label">Date of Birth:</span>
                <span className="id-card-val">{student.dob || 'N/A'}</span>
              </div>
              <div className="id-card-row">
                <span className="id-card-label">Blood Group:</span>
                <span className="id-card-val" style={{ color: '#e11d48' }}>{student.blood_group || 'O+'}</span>
              </div>
              <div className="id-card-row">
                <span className="id-card-label">Guardian:</span>
                <span className="id-card-val">{student.father_name || student.mother_name || 'N/A'}</span>
              </div>
              <div className="id-card-row">
                <span className="id-card-label">Emergency Phone:</span>
                <span className="id-card-val">{student.emergency_contact || 'N/A'}</span>
              </div>
            </div>

            {/* Footer with barcode */}
            <div className="id-card-footer">
              <div>
                <div style={{ fontSize: '0.6rem', color: '#64748b' }}>Authorized Signatory</div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0f172a' }}>Principal</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="barcode-sim">||| | |||| | |||</div>
                <div style={{ fontSize: '0.55rem', color: '#94a3b8' }}>{student.admission_number}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1rem' }}>
          TechRavisha Verified Smart ID • Standard CR80 PVC Specifications
        </div>
      </div>
    </Modal>
  );
};
