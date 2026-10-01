import React from 'react';
import { 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  ArrowRight,
  Info,
  FileText,
  UserPlus,
  Bell,
  Calendar
} from 'lucide-react';

export default function DashboardOverview({ stats, onNavigate, onSelectStudent }) {
  const totalStudents = stats?.totalStudents || 200;
  const avgAttendance = stats?.avgAttendance || 87;

  // Calculate fees summary
  const paidCount = stats?.feeStats?.find(f => f.Fees_Status === 'Paid')?.count || 137;
  const pendingCount = stats?.feeStats?.find(f => f.Fees_Status === 'Pending')?.count || 40;
  const partialCount = stats?.feeStats?.find(f => f.Fees_Status === 'Partial')?.count || 23;
  const totalPaidSum = stats?.feeStats?.reduce((acc, curr) => acc + (parseFloat(curr.totalPaid) || 0), 0) || 2747250;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 1rem 2rem 1rem' }}>
      
      {/* Institutional Hero Banner */}
      <div className="glass-panel" style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7), rgba(15, 23, 42, 0.85))',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.3rem 0.8rem', borderRadius: '9999px', marginBottom: '0.85rem' }}>
              <Calendar size={14} color="#818cf8" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc' }}>
                ACADEMIC SESSION 2026 – 2027
              </span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem', color: '#fff' }}>
              AegisEdu Student Intelligence Portal
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Centralized institutional student information management system with real-time attendance tracking, academic grading, and fee ledgers.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
            <button
              onClick={() => onNavigate('students')}
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '0.8rem 1.25rem', fontSize: '0.9rem' }}
            >
              <Users size={18} />
              <span>Student Directory ({totalStudents})</span>
            </button>

            <button
              onClick={() => onNavigate('notices')}
              className="btn-ghost"
              style={{ justifyContent: 'center', padding: '0.75rem 1.25rem' }}
            >
              <Bell size={16} />
              <span>Campus Circulars</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        {/* Card 1: Total Students */}
        <div className="glass-panel" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              Total Enrolled Students
            </span>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '0.5rem', borderRadius: '10px' }}>
              <Users size={20} color="#818cf8" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            {totalStudents}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#10b981' }}>
            <CheckCircle2 size={14} />
            <span>Active Student Records</span>
          </div>
        </div>

        {/* Card 2: Academic Standards */}
        <div className="glass-panel" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              Classes & Standards
            </span>
            <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '0.5rem', borderRadius: '10px' }}>
              <GraduationCap size={20} color="#06b6d4" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            4 Grades
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            7th, 8th, 9th, 10th (Sections A, B, C)
          </div>
        </div>

        {/* Card 3: Average Attendance */}
        <div className="glass-panel" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              Average Attendance
            </span>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '10px' }}>
              <Clock size={20} color="#10b981" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            {avgAttendance}%
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
            <div style={{ width: `${avgAttendance}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #06b6d4)' }} />
          </div>
        </div>

        {/* Card 4: Fee Realization */}
        <div className="glass-panel" style={{ padding: '1.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              Total Fee Realization
            </span>
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.5rem', borderRadius: '10px' }}>
              <IndianRupee size={20} color="#f59e0b" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
            ₹{(totalPaidSum / 100000).toFixed(2)} Lakhs
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.72rem' }}>
            <span style={{ color: '#34d399' }}>{paidCount} Paid</span> • 
            <span style={{ color: '#fbbf24' }}>{partialCount} Partial</span> • 
            <span style={{ color: '#fb7185' }}>{pendingCount} Pending</span>
          </div>
        </div>

      </div>

      {/* Main Content Grid: Standards Breakdown + Quick Management Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* Class Standard Distribution */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <GraduationCap size={18} color="#818cf8" />
            <span>Class-wise Enrollment Summary</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(stats?.standards || [
              { Standard: '10th', count: 52 },
              { Standard: '9th', count: 50 },
              { Standard: '8th', count: 50 },
              { Standard: '7th', count: 48 }
            ]).map((std) => {
              const pct = Math.round((std.count / totalStudents) * 100);
              return (
                <div key={std.Standard} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Standard {std.Standard}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <strong style={{ color: '#fff' }}>{std.count}</strong> students ({pct}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct * 3}%`, maxWidth: '100%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
            <button
              onClick={() => onNavigate('students')}
              className="btn-ghost"
              style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem' }}
            >
              <span>View All Students</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Quick Institutional Actions */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
              <FileText size={18} color="#818cf8" />
              <span>Administrative Quick Actions</span>
            </h2>
            <span className="badge badge-standard">Quick Links</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            <div 
              onClick={() => onNavigate('students')}
              style={{ 
                background: 'rgba(15, 23, 42, 0.7)', 
                padding: '0.85rem 1rem', 
                borderRadius: '10px', 
                border: '1px solid var(--border-glass)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-indigo)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Users size={15} color="#818cf8" />
                  <span>Browse Student Directory</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Search and review enrolled student rosters and details
                </div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>

            <div 
              onClick={() => onSelectStudent(1, 'profile')}
              style={{ 
                background: 'rgba(15, 23, 42, 0.7)', 
                padding: '0.85rem 1rem', 
                borderRadius: '10px', 
                border: '1px solid var(--border-glass)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-indigo)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <GraduationCap size={15} color="#818cf8" />
                  <span>Student Profile & Academic Dossier</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Review personal, academic, and fee records for students
                </div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>

            <div 
              onClick={() => onNavigate('notices')}
              style={{ 
                background: 'rgba(15, 23, 42, 0.7)', 
                padding: '0.85rem 1rem', 
                borderRadius: '10px', 
                border: '1px solid var(--border-glass)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-indigo)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bell size={15} color="#818cf8" />
                  <span>Campus Circulars & Notice Board</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Publish administrative broadcasts and examination notifications
                </div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>

            <div 
              onClick={() => onNavigate('about')}
              style={{ 
                background: 'rgba(15, 23, 42, 0.7)', 
                padding: '0.85rem 1rem', 
                borderRadius: '10px', 
                border: '1px solid var(--border-glass)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-indigo)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-glass)'}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Info size={15} color="#818cf8" />
                  <span>About Institutional Portal</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Institutional mission, academic standards, and contact details
                </div>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
