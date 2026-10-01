import React from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Users, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

export default function AboutSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 1rem 2rem 1rem' }}>
      
      {/* Hero Banner */}
      <div className="glass-panel" style={{
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7), rgba(15, 23, 42, 0.85))',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.35rem 0.85rem', borderRadius: '9999px', marginBottom: '1rem' }}>
            <Sparkles size={14} color="#818cf8" />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc' }}>
              EXCELLENCE IN EDUCATION SINCE 2012
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.75rem', color: '#fff' }}>
            About AegisEdu Institutional Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
            AegisEdu is a state-of-the-art institutional platform designed to empower schools and academic academies with transparent student data management, streamlined fee accounting, academic performance tracking, and seamless campus communications.
          </p>
        </div>
      </div>

      {/* Core Mission Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <GraduationCap size={22} color="#818cf8" />
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            Academic Rigor & Analytics
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Continuous assessment mechanisms tracking GPA distributions, terminal examinations, attendance compliance, and holistic student development across all standards.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <HeartHandshake size={22} color="#10b981" />
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            Student Welfare & Advisory
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Dedicated faculty mentoring, health record management, parent-teacher collaboration, and individualized counseling dossiers for each enrolled learner.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.2)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <ShieldCheck size={22} color="#06b6d4" />
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
            Institutional Governance
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Accredited standards compliance, synchronized administrative circulars, and transparent financial ledgers ensuring seamless campus operation.
          </p>
        </div>

      </div>

      {/* Institutional Overview & Campus Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* About Information */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={20} color="#818cf8" />
            <span>Our Educational Philosophy</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
            <p>
              At AegisEdu, we believe that education extends beyond textbook curricula. By leveraging integrated digital records, our educators can tailor learning interventions to students' unique strengths and requirements.
            </p>
            <p>
              Our automated information architecture enables paperless administration, instant fee reconciliations, and immediate broadcast of academic circulars to parents and faculty alike.
            </p>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Certified secondary education accreditation standards</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Integrated attendance and fee management systems</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Dedicated student counseling and academic dossiers</span>
            </div>
          </div>
        </div>

        {/* Campus Administration & Contact Info */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} color="#818cf8" />
            <span>Campus Office & Support</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                <MapPin size={18} color="#818cf8" />
              </div>
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>Campus Location</strong>
                <span style={{ color: 'var(--text-secondary)' }}>
                  AegisEdu Institutional Complex, Sector 12, Metro Heights, Academic Boulevard
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                <Mail size={18} color="#818cf8" />
              </div>
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>Institutional Email</strong>
                <span style={{ color: 'var(--text-secondary)' }}>
                  admissions@aegisedu.ac.in • registrar@aegisedu.ac.in
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                <Phone size={18} color="#818cf8" />
              </div>
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>Campus Helpline</strong>
                <span style={{ color: 'var(--text-secondary)' }}>
                  +91 (022) 2894-3400 / +91 (022) 2894-3401
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px' }}>
                <Clock size={18} color="#818cf8" />
              </div>
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>Operating Hours</strong>
                <span style={{ color: 'var(--text-secondary)' }}>
                  Monday – Saturday: 8:00 AM – 4:30 PM (IST)
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
