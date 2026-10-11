import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Table, 
  Terminal, 
  Play, 
  RefreshCw, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  FileCode, 
  Layers, 
  Search, 
  Key, 
  HardDrive,
  Copy,
  ChevronRight
} from 'lucide-react';

export default function DatabaseManager() {
  const [activeSubTab, setActiveSubTab] = useState('tables'); // 'tables' | 'query' | 'info'
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('student_data');
  const [tableData, setTableData] = useState({ rows: [], total: 0, limit: 50, offset: 0 });
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // SQL Console state
  const [sqlQuery, setSqlQuery] = useState('SELECT Sr_No, Name, Standard, Section, Roll_No, Fees_Status, GPA FROM student_data LIMIT 10;');
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [queryRunning, setQueryRunning] = useState(false);
  const [queryTimeMs, setQueryTimeMs] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // Preset query snippets
  const queryPresets = [
    { label: 'Students Overview', sql: 'SELECT Sr_No, Name, Standard, Section, Fees_Status, Fees_Paid, Attendance, GPA FROM student_data LIMIT 10;' },
    { label: 'Standard Counts', sql: 'SELECT Standard, COUNT(*) as Count, ROUND(AVG(Attendance), 1) as AvgAttendance FROM student_data GROUP BY Standard;' },
    { label: 'Fee Summary', sql: 'SELECT Fees_Status, COUNT(*) as Count, SUM(Fees_Paid) as TotalCollected FROM student_data GROUP BY Fees_Status;' },
    { label: 'Registered Users', sql: 'SELECT id, username, email, role, created_at FROM users;' },
    { label: 'Campus Notices', sql: 'SELECT id, title, category, author, pinned, created_at FROM notices;' },
    { label: 'Audit Logs', sql: 'SELECT * FROM audit_logs ORDER BY id DESC LIMIT 20;' }
  ];

  // Fetch DB tables and status
  const fetchTablesAndStatus = async () => {
    try {
      setLoading(true);
      const [resTables, resStatus] = await Promise.all([
        fetch('/api/db/tables'),
        fetch('/api/db-status')
      ]);

      const dataTables = await resTables.json();
      const dataStatus = await resStatus.json();

      setTables(dataTables.tables || []);
      setDbStatus(dataStatus);

      if (dataTables.tables?.length > 0 && !selectedTable) {
        setSelectedTable(dataTables.tables[0].name);
      }
    } catch (err) {
      console.error('Failed to load database schema:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data for selected table
  const fetchTableData = async (tableName) => {
    if (!tableName) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/db/tables/${tableName}?limit=50&offset=0`);
      const data = await res.json();
      setTableData(data);
    } catch (err) {
      console.error(`Failed to load data for table ${tableName}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTablesAndStatus();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      fetchTableData(selectedTable);
    }
  }, [selectedTable]);

  // Execute custom query
  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) return;
    setQueryRunning(true);
    setQueryError(null);
    setQueryResult(null);
    const start = performance.now();

    try {
      const res = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: sqlQuery })
      });
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setQueryTimeMs(elapsed);

      if (!res.ok || data.success === false) {
        setQueryError(data.error || 'Execution failed');
      } else {
        setQueryResult(data);
        fetchTablesAndStatus();
      }
    } catch (err) {
      setQueryError(err.message);
    } finally {
      setQueryRunning(false);
    }
  };

  // Reset database with sample data
  const handleResetDb = async () => {
    if (!window.confirm('Are you sure you want to restore the database to its default sample data?')) {
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/db/reset', { method: 'POST' });
      const data = await res.json();
      setActionMessage('Database successfully re-seeded with initial records.');
      setTimeout(() => setActionMessage(null), 4000);
      await fetchTablesAndStatus();
      if (selectedTable) await fetchTableData(selectedTable);
    } catch (err) {
      alert('Failed to reset database: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentTableObj = tables.find(t => t.name === selectedTable);

  const filteredRows = (tableData.rows || []).filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val => 
      String(val || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner & Control Strip */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', 
            padding: '0.85rem', 
            borderRadius: '14px', 
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Database size={26} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Database Management Console</h2>
              <span className="badge" style={{ 
                background: 'rgba(16, 185, 129, 0.15)', 
                color: '#34d399', 
                border: '1px solid rgba(16, 185, 129, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <CheckCircle2 size={12} />
                {dbStatus?.engine === 'sqlite' ? 'SQLite (Native & Zero-Admin)' : 'MySQL Engine'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Storage File: <code style={{ color: '#93c5fd', background: 'rgba(0,0,0,0.3)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{dbStatus?.dbFile || 'student.db'}</code>
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => { fetchTablesAndStatus(); if (selectedTable) fetchTableData(selectedTable); }}
            className="btn-ghost"
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.9rem' }}
            title="Refresh database state"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>

          <button 
            onClick={handleResetDb}
            className="btn-ghost"
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.9rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            title="Re-seed with sample student, user, and notice data"
          >
            <RotateCcw size={15} />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '10px',
          padding: '0.75rem 1.25rem',
          color: '#34d399',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveSubTab('tables')}
          className={`btn-ghost ${activeSubTab === 'tables' ? 'active-tab' : ''}`}
          style={{
            background: activeSubTab === 'tables' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
            borderColor: activeSubTab === 'tables' ? 'var(--accent-indigo)' : 'transparent',
            color: activeSubTab === 'tables' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <Table size={16} />
          <span>Table Explorer ({tables.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('query')}
          className={`btn-ghost ${activeSubTab === 'query' ? 'active-tab' : ''}`}
          style={{
            background: activeSubTab === 'query' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
            borderColor: activeSubTab === 'query' ? 'var(--accent-indigo)' : 'transparent',
            color: activeSubTab === 'query' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <Terminal size={16} />
          <span>SQL Query Console</span>
        </button>

        <button
          onClick={() => setActiveSubTab('info')}
          className={`btn-ghost ${activeSubTab === 'info' ? 'active-tab' : ''}`}
          style={{
            background: activeSubTab === 'info' ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
            borderColor: activeSubTab === 'info' ? 'var(--accent-indigo)' : 'transparent',
            color: activeSubTab === 'info' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          <HardDrive size={16} />
          <span>Connection & Guide</span>
        </button>
      </div>

      {/* VIEW 1: TABLE EXPLORER */}
      {activeSubTab === 'tables' && (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.25rem' }}>
          
          {/* Left Table List */}
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, padding: '0.25rem 0.5rem' }}>
              Database Tables
            </div>

            {tables.map(t => (
              <button
                key={t.name}
                onClick={() => setSelectedTable(t.name)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: selectedTable === t.name ? 'var(--accent-indigo)' : 'transparent',
                  background: selectedTable === t.name ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedTable === t.name ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={14} color={selectedTable === t.name ? '#a5b4fc' : '#94a3b8'} />
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{t.name}</span>
                </div>
                <span className="badge" style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.3)', padding: '0.1rem 0.4rem' }}>
                  {t.rowCount}
                </span>
              </button>
            ))}
          </div>

          {/* Right Table Data View */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
            
            {/* Header with Search and Columns summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{selectedTable}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.2rem' }}>
                  <span>{tableData.total} Total Records</span>
                  <span>•</span>
                  <span>{currentTableObj?.columns?.length || 0} Columns</span>
                </div>
              </div>

              {/* Search filter in current table */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder={`Search in ${selectedTable}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.75rem 0.45rem 2.2rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Schema Pill Bar */}
            {currentTableObj?.columns && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginRight: '0.4rem' }}>
                  SCHEMA:
                </span>
                {currentTableObj.columns.map(c => (
                  <span key={c.cid} style={{
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    background: c.pk ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.06)',
                    color: c.pk ? '#a5b4fc' : 'var(--text-secondary)',
                    border: c.pk ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {c.pk && <Key size={10} />}
                    <strong>{c.name}</strong> ({c.type})
                  </span>
                ))}
              </div>
            )}

            {/* Data Grid */}
            <div style={{ overflowX: 'auto', maxHeight: '520px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(15, 23, 42, 0.9)', position: 'sticky', top: 0, zIndex: 10 }}>
                    {currentTableObj?.columns?.map(c => (
                      <th key={c.name} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-glass)', color: '#cbd5e1', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={currentTableObj?.columns?.length || 1} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row, i) => (
                      <tr 
                        key={i} 
                        style={{ 
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          background: i % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'
                        }}
                      >
                        {currentTableObj?.columns?.map(col => {
                          const val = row[col.name];
                          return (
                            <td key={col.name} style={{ padding: '0.65rem 1rem', whiteSpace: 'nowrap', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {val === null || val === undefined ? (
                                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>null</span>
                              ) : typeof val === 'object' ? (
                                JSON.stringify(val)
                              ) : (
                                String(val)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 2: INTERACTIVE SQL QUERY CONSOLE */}
      {activeSubTab === 'query' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* SQL Editor Box */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={18} color="#818cf8" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>SQL Query Editor</span>
              </div>

              {/* Preset Snippets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Presets:</span>
                {queryPresets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSqlQuery(p.sql)}
                    className="btn-ghost"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem', borderRadius: '6px' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              placeholder="Enter standard SQL statement here (e.g. SELECT * FROM student_data WHERE Standard = '10th')"
              rows={5}
              style={{
                width: '100%',
                background: '#090d16',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '0.85rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                color: '#e2e8f0',
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.4
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tip: Standard SQL syntax is supported (SELECT, INSERT, UPDATE, DELETE).
              </span>

              <button
                onClick={handleExecuteQuery}
                disabled={queryRunning}
                className="btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
              >
                <Play size={14} />
                <span>{queryRunning ? 'Executing...' : 'Run Query'}</span>
              </button>
            </div>
          </div>

          {/* Query Error Notice */}
          {queryError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '10px',
              padding: '1rem',
              color: '#fca5a5',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}>
              <AlertCircle size={18} color="#ef4444" />
              <div>
                <strong>SQL Execution Error:</strong> {queryError}
              </div>
            </div>
          )}

          {/* Query Result Grid */}
          {queryResult && (
            <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#34d399' }}>
                    {queryResult.type === 'select' ? `${queryResult.rowCount} rows returned` : queryResult.message}
                  </span>
                </div>
                {queryTimeMs !== null && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Executed in {queryTimeMs}ms
                  </span>
                )}
              </div>

              {queryResult.type === 'select' && queryResult.rows?.length > 0 && (
                <div style={{ overflowX: 'auto', maxHeight: '420px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(15, 23, 42, 0.9)', position: 'sticky', top: 0 }}>
                        {Object.keys(queryResult.rows[0]).map(key => (
                          <th key={key} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-glass)', color: '#cbd5e1', fontWeight: 600 }}>
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {queryResult.rows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          {Object.values(row).map((val, vi) => (
                            <td key={vi} style={{ padding: '0.65rem 1rem', whiteSpace: 'nowrap' }}>
                              {val === null || val === undefined ? (
                                <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>null</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* VIEW 3: CONNECTION INFO & GUIDE */}
      {activeSubTab === 'info' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HardDrive size={18} color="#818cf8" />
              Active Database Details
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Database Engine:</span>
                <strong style={{ color: '#34d399' }}>SQLite 3 (Native in Node.js)</strong>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Administrator Rights Needed:</span>
                <strong style={{ color: '#34d399' }}>NO (Zero Admin Password Required)</strong>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Database File Path:</span>
                <code style={{ color: '#93c5fd', wordBreak: 'break-all' }}>{dbStatus?.dbFile || 'server/student.db'}</code>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tables Initialized:</span>
                <strong>{tables.length} tables (student_data, users, notices, audit_logs)</strong>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={18} color="#06b6d4" />
              How to Manage Your Database
            </h3>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p>
                <strong>1. Built-in Web Explorer:</strong> Use the <em>Table Explorer</em> tab on the left to inspect, filter, and review any table in your portal.
              </p>
              <p>
                <strong>2. Run Custom SQL:</strong> Use the <em>SQL Query Console</em> tab to run <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, or <code>DELETE</code> queries directly in the browser.
              </p>
              <p>
                <strong>3. Visual Editor Extension:</strong> You can open <code>server/student.db</code> directly in VS Code / Antigravity using the popular <strong>SQLite Viewer</strong> extension.
              </p>
              <p>
                <strong>4. Optional MySQL Migration:</strong> If you ever install MySQL later, set <code>DB_ENGINE=mysql</code> in <code>server/.env</code> and the server will seamlessly switch back to MySQL.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
