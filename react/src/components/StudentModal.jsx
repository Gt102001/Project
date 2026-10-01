import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  BookOpen, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  Upload, 
  Save,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function StudentModal({ studentId, initialTab = 'profile', onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [student, setStudent] = useState(null);
  const [confidentialData, setConfidentialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  // Form states
  const [feeAmount, setFeeAmount] = useState('5000');
  const [attendanceInput, setAttendanceInput] = useState('95');
  const [newRemark, setNewRemark] = useState('');
  const [queryId, setQueryId] = useState(studentId);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  useEffect(() => {
    fetchStudent(studentId);
    if (activeTab === 'confidential') {
      fetchConfidential(studentId);
    }
  }, [studentId]);

  const fetchStudent = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students/${id}`);
      const data = await res.json();
      setStudent(data);
      setAttendanceInput(data.Attendance || 85);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConfidential = async (id) => {
    try {
      const res = await fetch(`/api/students/${id}/confidential`);
      const data = await res.json();
      setConfidentialData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/students/${student.Sr_No}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });
      const data = await res.json();
      setStatusMsg({ type: 'success', text: data.message || 'Profile updated successfully' });
      onRefresh();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleFeePayment = async (e) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/students/${student.Sr_No}/pay-fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: feeAmount }),
      });
      const data = await res.json();
      setStatusMsg({ type: 'success', text: data.message });
      fetchStudent(student.Sr_No);
      onRefresh();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleAttendanceUpdate = async (e) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/students/${student.Sr_No}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendance: parseInt(attendanceInput, 10) }),
      });
      const data = await res.json();
      setStatusMsg({ type: 'success', text: data.message });
      fetchStudent(student.Sr_No);
      onRefresh();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleAddRemark = async (e) => {
    e.preventDefault();
    if (!newRemark) return;
    try {
      const updatedRemarks = student.Remarks ? `${student.Remarks} <br/> ${newRemark}` : newRemark;
      await fetch(`/api/students/${student.Sr_No}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Remarks: updatedRemarks }),
      });
      setNewRemark('');
      fetchStudent(student.Sr_No);
      setStatusMsg({ type: 'success', text: 'Remark logged successfully.' });
      onRefresh();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setUploadResult(data);
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    }
  };

  if (loading && !student) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="pulse-indicator" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', margin: '0 auto 1rem' }} />
          <div>Loading student profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem',
    }}>
      <div 
        className="glass-panel fade-in"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        
        {/* Modal Header */}
        <div style={{ 
          padding: '1.25rem 1.5rem', 
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img 
              src={student?.Avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${student?.Name}`}
              alt={student?.Name}
              style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  {student?.Name}
                </h2>
                <span className="badge badge-standard font-mono">
                  {student?.Roll_No}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Standard {student?.Standard} • Section {student?.Section || 'A'} • Student ID #{student?.Sr_No}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="btn-ghost"
            style={{ padding: '0.45rem', borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Status / Alert Banner */}
        {statusMsg && (
          <div style={{
            padding: '0.65rem 1.5rem',
            background: statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            borderBottom: '1px solid var(--border-glass)',
            color: statusMsg.type === 'error' ? '#fca5a5' : '#86efac',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={15} />
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Modal Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-glass)', 
          background: 'rgba(0,0,0,0.15)',
          overflowX: 'auto',
          padding: '0 1rem'
        }}>
          {[
            { id: 'profile', label: 'Personal Bio', icon: User },
            { id: 'academic', label: 'Academic & Attendance', icon: BookOpen },
            { id: 'fees', label: 'Fee Ledger', icon: CreditCard },
            { id: 'confidential', label: 'Confidential Records', icon: FileText },
            { id: 'remarks', label: 'Teacher Remarks', icon: MessageSquare },
            { id: 'upload', label: 'Upload Documents', icon: Upload },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'confidential') fetchConfidential(student.Sr_No);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.85rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--accent-indigo)' : '2px solid transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={15} color={isActive ? '#818cf8' : 'currentColor'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body / Tab Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          
          {/* TAB 1: Profile & Bio Form */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Full Name</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={student?.Name || ''}
                    onChange={(e) => setStudent({ ...student, Name: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Roll Number</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={student?.Roll_No || ''}
                    onChange={(e) => setStudent({ ...student, Roll_No: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Class Standard</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={student?.Standard || ''}
                    onChange={(e) => setStudent({ ...student, Standard: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Section</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={student?.Section || ''}
                    onChange={(e) => setStudent({ ...student, Section: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Email</label>
                  <input
                    type="email"
                    className="glass-input"
                    value={student?.Email || ''}
                    onChange={(e) => setStudent({ ...student, Email: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Phone</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={student?.Phone || ''}
                    onChange={(e) => setStudent({ ...student, Phone: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Father's Name</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={student?.Father_Name || ''}
                    onChange={(e) => setStudent({ ...student, Father_Name: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Blood Group</label>
                  <input
                    type="text"
                    className="glass-input"
                    value={student?.Blood_Group || ''}
                    onChange={(e) => setStudent({ ...student, Blood_Group: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Residential Address</label>
                <textarea
                  className="glass-input"
                  rows={2}
                  value={student?.Address || ''}
                  onChange={(e) => setStudent({ ...student, Address: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary" disabled={saving}>
                  <Save size={16} />
                  <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Academic & Attendance */}
          {activeTab === 'academic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Current Academic Standing</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>GPA Grade</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{student?.GPA || 'A'}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Recorded Attendance</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8' }}>{student?.Attendance}%</div>
                  </div>
                </div>
              </div>

              {/* Attendance Form */}
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.5rem' }}>Update Attendance Record</h4>
                <form onSubmit={handleAttendanceUpdate} style={{ display: 'flex', gap: '0.75rem' }}>
                  <input
                    type="number"
                    className="glass-input"
                    placeholder="Enter percentage"
                    value={attendanceInput}
                    onChange={(e) => setAttendanceInput(e.target.value)}
                    style={{ maxWidth: '250px' }}
                  />
                  <button type="submit" className="btn-primary">
                    Update Attendance
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: Fee Ledger */}
          {activeTab === 'fees' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Institutional Fee Ledger</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Total Annual Fees</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>₹{student?.Fees_Amount || 18500}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Amount Deposited</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>₹{student?.Fees_Paid}</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Outstanding Dues</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: (student?.Fees_Amount - student?.Fees_Paid) > 0 ? '#fb7185' : '#34d399' }}>
                      ₹{Math.max(0, (student?.Fees_Amount || 18500) - (student?.Fees_Paid || 0))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Record Fee Payment Form */}
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.75rem' }}>Record Fee Transaction</h4>
                <form onSubmit={handleFeePayment} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <input
                    type="number"
                    className="glass-input"
                    placeholder="Enter fee amount"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(e.target.value)}
                    style={{ maxWidth: '250px' }}
                  />
                  <button type="submit" className="btn-primary">
                    Record Payment
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: Confidential Records */}
          {activeTab === 'confidential' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Record ID Selector */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Student Record ID:</span>
                <input
                  type="number"
                  className="glass-input"
                  value={queryId}
                  onChange={(e) => setQueryId(e.target.value)}
                  style={{ width: '90px' }}
                />
                <button
                  onClick={() => fetchConfidential(queryId)}
                  className="btn-primary"
                  style={{ fontSize: '0.8rem' }}
                >
                  Retrieve Record
                </button>
              </div>

              {confidentialData?.record ? (
                <div className="glass-panel" style={{ padding: '1.25rem', background: '#0b0f19' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                      {confidentialData.record.Name} (Student #{confidentialData.record.Sr_No})
                    </h3>
                    <span className="badge badge-standard">CONFIDENTIAL DOSSIER</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
                    <div style={{ background: 'rgba(99,102,241,0.1)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <strong style={{ color: '#a5b4fc' }}>Medical & Health Observations:</strong>
                      <div style={{ color: '#fff', marginTop: '0.35rem' }}>
                        {confidentialData.record.Medical_History || 'No specific notes logged'}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Father: </span>
                        <strong>{confidentialData.record.Father_Name}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Mother: </span>
                        <strong>{confidentialData.record.Mother_Name}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Emergency Contact: </span>
                        <strong className="font-mono" style={{ color: '#818cf8' }}>{confidentialData.record.Emergency_Contact}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Address: </span>
                        <strong>{confidentialData.record.Address}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                  No confidential record found for ID #{queryId}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Teacher Remarks */}
          {activeTab === 'remarks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="glass-panel" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Official Faculty Remarks:</h4>
                <div 
                  style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', color: '#fff', minHeight: '60px' }}
                  dangerouslySetInnerHTML={{ __html: student?.Remarks || '<em>No remarks recorded yet</em>' }}
                />
              </div>

              {/* Add Remark Form */}
              <form onSubmit={handleAddRemark} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add New Academic Observation:</label>
                <textarea
                  className="glass-input"
                  rows={3}
                  placeholder="Enter observation or teacher remarks..."
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                />
                
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn-primary" style={{ fontSize: '0.825rem' }}>
                    Post Remark
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: Document Upload */}
          {activeTab === 'upload' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select Student Certificate or File to Upload:</label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="glass-input"
                  style={{ padding: '0.85rem' }}
                />
                
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                  <Upload size={16} />
                  <span>Upload Document</span>
                </button>
              </form>

              {uploadResult && (
                <div className="glass-panel" style={{ padding: '1rem', background: '#090d16' }}>
                  <div style={{ color: '#10b981', fontWeight: 700, marginBottom: '0.5rem' }}>
                    ✓ Document Stored:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div>Filename: <code className="font-mono" style={{ color: '#a5b4fc' }}>{uploadResult.filename}</code></div>
                    <div>Direct Link: 
                      <a 
                        href={uploadResult.directAccessUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: '#38bdf8', marginLeft: '0.4rem', textDecoration: 'underline' }}
                      >
                        {uploadResult.directAccessUrl}
                        <ExternalLink size={12} style={{ display: 'inline', marginLeft: '0.2rem' }} />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
