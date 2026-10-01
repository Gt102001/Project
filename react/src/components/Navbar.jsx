import React from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Bell, 
  Info, 
  UserCheck, 
  Lock, 
  GraduationCap
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  currentRole, 
  setCurrentRole, 
  onOpenLogin
}) {
  const roles = [
    { id: 'student', label: 'Student (Aarav)', badge: 'Student' },
    { id: 'teacher', label: 'Teacher (Sharma)', badge: 'Staff' },
    { id: 'admin', label: 'Administrator', badge: 'Admin' },
    { id: 'guest', label: 'Guest User', badge: 'Guest' },
  ];

  return (
    <header className="glass-panel" style={{ margin: '1rem', padding: '0.85rem 1.5rem', position: 'sticky', top: '1rem', zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setCurrentTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            padding: '0.6rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <GraduationCap size={22} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AegisEdu
              </span>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', fontSize: '0.65rem' }}>
                Portal Live
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Institutional Student Information System
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.25)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`btn-ghost ${currentTab === 'dashboard' ? 'active-tab' : ''}`}
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.85rem',
              background: currentTab === 'dashboard' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              borderColor: currentTab === 'dashboard' ? 'var(--accent-indigo)' : 'transparent',
              color: currentTab === 'dashboard' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('students')}
            className={`btn-ghost ${currentTab === 'students' ? 'active-tab' : ''}`}
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.85rem',
              background: currentTab === 'students' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              borderColor: currentTab === 'students' ? 'var(--accent-indigo)' : 'transparent',
              color: currentTab === 'students' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <Users size={16} />
            <span>Students (200)</span>
          </button>

          <button
            onClick={() => setCurrentTab('notices')}
            className={`btn-ghost ${currentTab === 'notices' ? 'active-tab' : ''}`}
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.85rem',
              background: currentTab === 'notices' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              borderColor: currentTab === 'notices' ? 'var(--accent-indigo)' : 'transparent',
              color: currentTab === 'notices' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <Bell size={16} />
            <span>Notice Board</span>
          </button>

          <button
            onClick={() => setCurrentTab('about')}
            className={`btn-ghost ${currentTab === 'about' ? 'active-tab' : ''}`}
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.85rem',
              background: currentTab === 'about' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
              borderColor: currentTab === 'about' ? 'var(--accent-indigo)' : 'transparent',
              color: currentTab === 'about' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <Info size={16} />
            <span>About Us</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Active Role Selector */}
          <div style={{ position: 'relative' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'rgba(15, 23, 42, 0.7)', 
              padding: '0.4rem 0.75rem', 
              borderRadius: '10px', 
              border: '1px solid var(--border-glass)',
              fontSize: '0.8rem'
            }}>
              <UserCheck size={15} color={currentRole === 'admin' ? '#818cf8' : '#10b981'} />
              <span style={{ color: 'var(--text-muted)' }}>Role:</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: currentRole === 'admin' ? '#a5b4fc' : '#86efac',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id} style={{ background: '#111827', color: '#fff' }}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sign In Button */}
          <button 
            onClick={onOpenLogin}
            className="btn-primary"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
          >
            <Lock size={14} />
            <span>Sign In</span>
          </button>

        </div>

      </div>
    </header>
  );
}
