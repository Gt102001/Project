import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import StudentDirectory from './components/StudentDirectory';
import StudentModal from './components/StudentModal';
import NoticeBoard from './components/NoticeBoard';
import AboutSection from './components/AboutSection';
import LoginModal from './components/LoginModal';
import CreateStudentModal from './components/CreateStudentModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('admin');
  const [stats, setStats] = useState(null);

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCreateStudentOpen, setIsCreateStudentOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [studentModalTab, setStudentModalTab] = useState('profile');

  // Fetch Institutional stats
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
        {currentTab === 'dashboard' && (
          <DashboardOverview
            stats={stats}
            onNavigate={(tab) => setCurrentTab(tab)}
            onSelectStudent={(id, tab) => {
              setSelectedStudentId(id);
              setStudentModalTab(tab);
            }}
          />
        )}

        {currentTab === 'students' && (
          <StudentDirectory
            currentRole={currentRole}
            onSelectStudent={(id, tab) => {
              setSelectedStudentId(id);
              setStudentModalTab(tab);
            }}
            onOpenCreateStudent={() => setIsCreateStudentOpen(true)}
          />
        )}

        {currentTab === 'notices' && <NoticeBoard />}

        {currentTab === 'about' && <AboutSection />}
      </main>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-glass)', 
        padding: '1.25rem 2rem', 
        marginTop: 'auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '1rem',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        background: 'rgba(5, 8, 16, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>© 2026 AegisEdu Institutional Portal. All rights reserved.</span>
          <span>•</span>
          <span style={{ color: '#10b981' }}>Academic Portal Online</span>
        </div>
      </footer>

      {/* Student Dossier / Profile Modal */}
      {selectedStudentId && (
        <StudentModal
          studentId={selectedStudentId}
          initialTab={studentModalTab}
          onClose={() => setSelectedStudentId(null)}
          onRefresh={() => {
            fetchStats();
          }}
        />
      )}

      {/* Enroll New Student Modal */}
      {isCreateStudentOpen && (
        <CreateStudentModal
          isOpen={isCreateStudentOpen}
          onClose={() => setIsCreateStudentOpen(false)}
          onCreated={() => {
            fetchStats();
            setCurrentTab('students');
          }}
        />
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentRole(user.role);
            setIsLoginOpen(false);
          }}
        />
      )}

    </div>
  );
}
