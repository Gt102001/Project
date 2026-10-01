import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User, 
  Key, 
  UserPlus
} from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({ type: 'error', message: data.error || 'Authentication Failed', sql: data.sql });
      } else {
        setResult({ type: 'success', message: 'Authentication Successful!', token: data.token, user: data.user });
        onLoginSuccess(data.user, data.token);
      }
    } catch (err) {
      setResult({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setResult({ type: 'error', message: data.error });
      } else {
        setResult({ type: 'success', message: data.message });
        setMode('login');
      }
    } catch (err) {
      setResult({ type: 'error', message: err.message });
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
          maxWidth: '460px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
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
              <Lock size={18} color="#818cf8" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                {mode === 'login' ? 'Institutional Authentication' : 'Create Student / Staff Account'}
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {mode === 'login' ? 'Enter your credentials to access system' : 'Register a new institutional profile'}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn-ghost" style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.1)' }}>
          <button
            onClick={() => { setMode('login'); setResult(null); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'transparent',
              border: 'none',
              borderBottom: mode === 'login' ? '2px solid var(--accent-indigo)' : '2px solid transparent',
              color: mode === 'login' ? '#fff' : 'var(--text-secondary)',
              fontWeight: mode === 'login' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>

          <button
            onClick={() => { setMode('register'); setResult(null); }}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'transparent',
              border: 'none',
              borderBottom: mode === 'register' ? '2px solid var(--accent-indigo)' : '2px solid transparent',
              color: mode === 'register' ? '#fff' : 'var(--text-secondary)',
              fontWeight: mode === 'register' ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Register Account
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '1.5rem' }}>
          
          {mode === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Username</label>
                <input
                  type="text"
                  placeholder="admin or username"
                  className="glass-input font-mono"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="glass-input font-mono"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Username</label>
                <input
                  type="text"
                  placeholder="new_user"
                  className="glass-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Email</label>
                <input
                  type="email"
                  placeholder="user@aegisedu.ac.in"
                  className="glass-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Password</label>
                <input
                  type="password"
                  placeholder="password"
                  className="glass-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Account Role:
                </label>
                <select
                  className="glass-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Administrator</option>
                  <option value="teacher">Faculty Staff</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
                <UserPlus size={16} />
                <span>Register User</span>
              </button>
            </form>
          )}

          {/* Result Alert */}
          {result && (
            <div style={{
              marginTop: '1rem',
              padding: '0.85rem',
              borderRadius: '8px',
              background: result.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: result.type === 'error' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '0.8rem',
              color: result.type === 'error' ? '#fca5a5' : '#86efac'
            }}>
              <div>{result.message}</div>
              {result.token && (
                <div style={{ marginTop: '0.5rem', wordBreak: 'break-all' }}>
                  <strong>Session Token:</strong>
                  <code className="font-mono" style={{ display: 'block', background: '#090d16', padding: '0.4rem', borderRadius: '4px', marginTop: '0.25rem', color: '#a5b4fc' }}>
                    {result.token}
                  </code>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
