import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Pin, 
  Calendar, 
  User, 
  RefreshCw
} from 'lucide-react';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Academic');
  const [author, setAuthor] = useState('Academic Council');
  const [alertMsg, setAlertMsg] = useState(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notices');
      const data = await res.json();
      setNotices(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category, author }),
      });
      const data = await res.json();
      setAlertMsg({ type: 'success', text: data.message });
      setTitle('');
      setContent('');
      setShowCreate(false);
      fetchNotices();
    } catch (err) {
      setAlertMsg({ type: 'error', text: err.message });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0 1rem 2rem 1rem' }}>
      
      {/* Notice Board Header */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={22} color="#818cf8" />
              <span>Campus Circulars & Notice Board</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Official administrative notices and academic broadcasts
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="btn-primary"
            >
              <Plus size={16} />
              <span>Broadcast Notice</span>
            </button>
            <button
              onClick={fetchNotices}
              className="btn-ghost"
              title="Refresh Notices"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Success / Alert message */}
      {alertMsg && (
        <div style={{ padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#86efac', fontSize: '0.85rem' }}>
          {alertMsg.text}
        </div>
      )}

      {/* Create Notice Collapsible Form */}
      {showCreate && (
        <form onSubmit={handleCreateNotice} className="glass-panel fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Post New Campus Announcement</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Notice Headline</label>
              <input
                type="text"
                placeholder="e.g. Annual Sports Meet 2026"
                className="glass-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Category</label>
              <select
                className="glass-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Academic">Academic</option>
                <option value="Examination">Examination</option>
                <option value="Events">Campus Events</option>
                <option value="Sports">Sports</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Issuing Authority</label>
              <input
                type="text"
                placeholder="e.g. Principal Office"
                className="glass-input"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Announcement Body</label>
            <textarea
              rows={4}
              placeholder="Enter announcement text..."
              className="glass-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={() => setShowCreate(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Publish Notice
            </button>
          </div>
        </form>
      )}

      {/* Notice List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="glass-panel fade-in"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: notice.pinned ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-glass)',
              background: notice.pinned ? 'rgba(20, 25, 45, 0.8)' : 'rgba(17, 24, 39, 0.75)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-standard">{notice.category}</span>
                {notice.pinned && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>
                    <Pin size={13} />
                    <span>PINNED</span>
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                {notice.title}
              </h2>

              <div 
                style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}
                dangerouslySetInnerHTML={{ __html: notice.content }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={13} />
                <span>{notice.author}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={13} />
                <span>{new Date(notice.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
