import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Trash2, 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus,
  RefreshCw,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function StudentDirectory({ 
  onSelectStudent, 
  onOpenCreateStudent,
  initialQuery = '',
  currentRole 
}) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);
  const [search, setSearch] = useState(initialQuery);
  const [standard, setStandard] = useState('All');
  const [section, setSection] = useState('All');
  const [fees, setFees] = useState('All');
  const [sort, setSort] = useState('Sr_No');
  const [order, setOrder] = useState('ASC');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const fetchStudents = async () => {
    setLoading(true);
    setErrorInfo(null);
    try {
      const params = new URLSearchParams({
        search,
        standard,
        section,
        fees,
        sort,
        order,
        page,
        limit: 12,
      });

      const res = await fetch(`/api/students?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setErrorInfo(data);
        setStudents([]);
      } else {
        setStudents(data.students || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (err) {
      const isOffline = typeof navigator !== 'undefined' && (!navigator.onLine || err.message === 'Failed to fetch');
      setErrorInfo({ 
        error: isOffline ? 'Network Connection Error (Offline Mode)' : 'System Error', 
        sqlMessage: isOffline 
          ? 'Network request failed (net::ERR_INTERNET_DISCONNECTED). In Chrome DevTools Network tab, ensure throttling is set to "No throttling" (not "Offline"), or verify your network connection.' 
          : err.message 
      });
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, standard, section, fees, sort, order, page]);

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete student record #${id} (${name})?`)) return;

    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      const data = await res.json();
      alert(data.message || 'Record deleted successfully');
      fetchStudents();
    } catch (err) {
      alert(`Delete operation failed: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0 1rem 2rem 1rem' }}>
      
      {/* Top Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Student Master Directory</span>
              <span className="badge badge-standard">{totalCount} Enrolled</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Institutional student roster with real-time query filters and status indicators
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => onOpenCreateStudent()}
              className="btn-primary"
            >
              <UserPlus size={16} />
              <span>Enroll New Student</span>
            </button>

            <button
              onClick={() => fetchStudents()}
              className="btn-ghost"
              title="Refresh Directory"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Search input */}
        <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by student name, roll number, or email..."
              className="glass-input"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{ paddingLeft: '2.75rem' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters and Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            
            {/* Standard Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Class:</span>
              <select
                value={standard}
                onChange={(e) => { setStandard(e.target.value); setPage(1); }}
                className="glass-input"
                style={{ padding: '0.35rem 0.6rem', width: 'auto', fontSize: '0.8rem' }}
              >
                <option value="All">All Standards</option>
                <option value="7th">7th Standard</option>
                <option value="8th">8th Standard</option>
                <option value="9th">9th Standard</option>
                <option value="10th">10th Standard</option>
              </select>
            </div>

            {/* Section Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Section:</span>
              <select
                value={section}
                onChange={(e) => { setSection(e.target.value); setPage(1); }}
                className="glass-input"
                style={{ padding: '0.35rem 0.6rem', width: 'auto', fontSize: '0.8rem' }}
              >
                <option value="All">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
            </div>

            {/* Fee Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Fees:</span>
              <select
                value={fees}
                onChange={(e) => { setFees(e.target.value); setPage(1); }}
                className="glass-input"
                style={{ padding: '0.35rem 0.6rem', width: 'auto', fontSize: '0.8rem' }}
              >
                <option value="All">All Fees Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="glass-input"
                style={{ padding: '0.35rem 0.6rem', width: 'auto', fontSize: '0.8rem' }}
              >
                <option value="Sr_No">Student ID</option>
                <option value="Name">Student Name</option>
                <option value="Attendance">Attendance %</option>
                <option value="Fees_Paid">Fees Deposited</option>
              </select>
            </div>

          </div>

          {/* View mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`btn-ghost ${viewMode === 'grid' ? 'active-tab' : ''}`}
              style={{ padding: '0.4rem 0.6rem', background: viewMode === 'grid' ? 'rgba(99, 102, 241, 0.3)' : 'transparent' }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`btn-ghost ${viewMode === 'table' ? 'active-tab' : ''}`}
              style={{ padding: '0.4rem 0.6rem', background: viewMode === 'table' ? 'rgba(99, 102, 241, 0.3)' : 'transparent' }}
            >
              <List size={16} />
            </button>
          </div>

        </div>

      </div>

      {/* Error Notice */}
      {errorInfo && (
        <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(30, 15, 20, 0.8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: 700 }}>
              <AlertCircle size={18} />
              <span>{errorInfo.error || 'System Notice'}</span>
            </div>
            <button
              onClick={fetchStudents}
              className="btn-primary"
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <RefreshCw size={14} />
              Retry Request
            </button>
          </div>
          <div style={{ background: '#090d16', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.85rem' }}>
            <div style={{ color: '#fca5a5' }}>
              <strong>Notice:</strong> {errorInfo.sqlMessage || errorInfo.error}
            </div>
          </div>
        </div>
      )}

      {/* Students Listing (Cards or Table) */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div className="pulse-indicator" style={{ display: 'inline-block', width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', marginBottom: '1rem' }} />
          <div>Retrieving student records...</div>
        </div>
      ) : students.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Search size={36} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No student records found</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Try clearing filters or resetting the search query</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
          {students.map((student) => (
            <div
              key={student.Sr_No}
              className="glass-panel fade-in"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
            >
              
              <div>
                {/* Header with Avatar and Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={student.Avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.Name}`}
                      alt={student.Name}
                      style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                        {student.Name}
                      </h3>
                      <div className="font-mono" style={{ fontSize: '0.75rem', color: '#818cf8' }}>
                        {student.Roll_No || `STU-${student.Sr_No}`}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${
                    student.Fees_Status === 'Paid' ? 'badge-paid' :
                    student.Fees_Status === 'Partial' ? 'badge-partial' : 'badge-pending'
                  }`}>
                    {student.Fees_Status}
                  </span>
                </div>

                {/* Info Pills */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-standard">
                    Class {student.Standard} - Sec {student.Section || 'A'}
                  </span>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                    GPA: {student.GPA || 'A'}
                  </span>
                </div>

                {/* Email / Contact */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div>Email: <span style={{ color: 'var(--text-secondary)' }}>{student.Email}</span></div>
                  <div>Contact: <span style={{ color: 'var(--text-secondary)' }}>{student.Phone}</span></div>
                </div>

                {/* Attendance Bar */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Attendance</span>
                    <span style={{ color: student.Attendance > 85 ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                      {student.Attendance}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${Math.min(100, Math.max(0, student.Attendance))}%`,
                      height: '100%',
                      background: student.Attendance > 85 ? '#10b981' : '#f59e0b',
                    }} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid var(--border-glass)', paddingTop: '0.85rem' }}>
                <button
                  onClick={() => onSelectStudent(student.Sr_No, 'profile')}
                  className="btn-ghost"
                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.78rem', justifyContent: 'center' }}
                >
                  <Eye size={14} />
                  <span>Dossier</span>
                </button>

                <button
                  onClick={() => onSelectStudent(student.Sr_No, 'confidential')}
                  className="btn-ghost"
                  style={{ 
                    padding: '0.45rem 0.6rem', 
                    fontSize: '0.78rem', 
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    color: '#a5b4fc'
                  }}
                  title="Confidential Records"
                >
                  <FileText size={13} color="#818cf8" />
                  <span>Records</span>
                </button>

                <button
                  onClick={(e) => handleDelete(e, student.Sr_No, student.Name)}
                  className="btn-ghost"
                  style={{ padding: '0.45rem 0.6rem', color: '#f43f5e' }}
                  title="Delete Student"
                >
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.3)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>Student Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Roll No</th>
                <th style={{ padding: '0.85rem 1rem' }}>Class & Sec</th>
                <th style={{ padding: '0.85rem 1rem' }}>Attendance</th>
                <th style={{ padding: '0.85rem 1rem' }}>Fee Status</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr 
                  key={student.Sr_No}
                  style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background 0.2s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.85rem 1rem' }} className="font-mono">#{student.Sr_No}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={student.Avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.Name}`} style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                      <strong style={{ color: '#fff' }}>{student.Name}</strong>
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }} className="font-mono" style={{ color: '#818cf8' }}>{student.Roll_No}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>{student.Standard} - {student.Section}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ color: student.Attendance > 85 ? '#34d399' : '#fbbf24', fontWeight: 600 }}>{student.Attendance}%</span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${student.Fees_Status === 'Paid' ? 'badge-paid' : student.Fees_Status === 'Partial' ? 'badge-partial' : 'badge-pending'}`}>
                      {student.Fees_Status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => onSelectStudent(student.Sr_No, 'profile')}
                        className="btn-ghost"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        Dossier
                      </button>
                      <button
                        onClick={() => onSelectStudent(student.Sr_No, 'confidential')}
                        className="btn-ghost"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.75rem', color: '#a5b4fc' }}
                        title="Confidential Records"
                      >
                        <FileText size={12} color="#818cf8" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-ghost"
            style={{ padding: '0.5rem', opacity: page === 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} />
          </button>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0 0.5rem' }}>
            Page <strong style={{ color: '#fff' }}>{page}</strong> of <strong style={{ color: '#fff' }}>{totalPages}</strong>
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-ghost"
            style={{ padding: '0.5rem', opacity: page === totalPages ? 0.4 : 1 }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

    </div>
  );
}
