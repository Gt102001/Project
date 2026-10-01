import React, { useState } from 'react';
import { X, UserPlus, Save, AlertTriangle } from 'lucide-react';

export default function CreateStudentModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    Name: '',
    Standard: '10th',
    Section: 'A',
    Roll_No: '',
    Email: '',
    Phone: '',
    Gender: 'Male',
    DOB: '2008-05-15',
    Blood_Group: 'B+',
    Address: '',
    Father_Name: '',
    Mother_Name: '',
    Emergency_Contact: '',
    Fees_Status: 'Paid',
    Fees_Amount: '18500',
    Fees_Paid: '18500',
    Attendance: '90',
    GPA: 'A+',
    Remarks: 'Newly enrolled student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create student');
      } else {
        onCreated();
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '1rem',
    }}>
      <div 
        className="glass-panel fade-in"
        style={{
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.5rem', borderRadius: '10px' }}>
              <UserPlus size={18} color="#818cf8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                Enroll New Student
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Enter student admission details for institutional registry
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Full Student Name *</label>
              <input
                type="text"
                name="Name"
                placeholder="e.g. Yash Vardhan"
                className="glass-input"
                value={formData.Name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Roll Number</label>
              <input
                type="text"
                name="Roll_No"
                placeholder="STU-10A-201"
                className="glass-input"
                value={formData.Roll_No}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Class Standard *</label>
              <select name="Standard" className="glass-input" value={formData.Standard} onChange={handleChange}>
                <option value="10th">10th Standard</option>
                <option value="9th">9th Standard</option>
                <option value="8th">8th Standard</option>
                <option value="7th">7th Standard</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Section *</label>
              <select name="Section" className="glass-input" value={formData.Section} onChange={handleChange}>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Email Address</label>
              <input
                type="email"
                name="Email"
                placeholder="student@aegisedu.ac.in"
                className="glass-input"
                value={formData.Email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Contact Phone</label>
              <input
                type="text"
                name="Phone"
                placeholder="+91 98XXXXXXXX"
                className="glass-input"
                value={formData.Phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Father's Name</label>
              <input
                type="text"
                name="Father_Name"
                placeholder="Parent Name"
                className="glass-input"
                value={formData.Father_Name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Emergency Contact</label>
              <input
                type="text"
                name="Emergency_Contact"
                placeholder="+91 97XXXXXXXX"
                className="glass-input"
                value={formData.Emergency_Contact}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Residential Address</label>
            <textarea
              name="Address"
              rows={2}
              placeholder="Residential address..."
              className="glass-input"
              value={formData.Address}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Save size={16} />
              <span>{loading ? 'Enrolling Student...' : 'Enroll Student'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
