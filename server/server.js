import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db, setupDatabase } from './db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(uploadDir));

// HTTP Request Logger Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (!req.originalUrl.startsWith('/assets/')) {
      const time = new Date().toLocaleTimeString();
      const statusIcon = res.statusCode >= 500 ? '❌' : res.statusCode >= 400 ? '⚠️' : '⚡';
      console.log(`${statusIcon} [${time}] ${req.method} ${req.originalUrl} -> HTTP ${res.statusCode} (${Date.now() - start}ms)`);
    }
  });
  next();
});

// ==========================================
// 0. DATABASE STATUS & WEB MANAGEMENT APIS
// ==========================================
app.get('/api/db-status', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 as connected');
    const tables = db.getTables ? db.getTables() : [];
    res.json({
      status: 'connected',
      engine: db.getEngine ? db.getEngine() : 'mysql',
      dbFile: db.getDbFilePath ? db.getDbFilePath() : 'MySQL Server',
      tablesCount: tables.length,
      message: 'Database operational and connected',
    });
  } catch (err) {
    res.status(500).json({
      status: 'disconnected',
      error: err.message,
    });
  }
});

// Get all tables and schema info for Web Database Manager
app.get('/api/db/tables', (req, res) => {
  try {
    if (!db.getTables) return res.status(501).json({ error: 'Not supported on current engine' });
    const tables = db.getTables();
    res.json({
      engine: db.getEngine(),
      dbPath: db.getDbFilePath(),
      tables,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get table data
app.get('/api/db/tables/:name', (req, res) => {
  const { name } = req.params;
  const { limit = 50, offset = 0, sortBy, order = 'ASC' } = req.query;
  try {
    if (!db.getTableData) return res.status(501).json({ error: 'Not supported on current engine' });
    const data = db.getTableData(name, parseInt(limit, 10), parseInt(offset, 10), sortBy, order);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Execute custom SQL query from the UI console
app.post('/api/db/query', (req, res) => {
  const { sql } = req.body;
  try {
    if (!db.executeCustomSql) return res.status(501).json({ error: 'Not supported on current engine' });
    const result = db.executeCustomSql(sql);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Reset database to initial sample data
app.post('/api/db/reset', (req, res) => {
  try {
    if (!db.resetDatabase) return res.status(501).json({ error: 'Not supported on current engine' });
    const result = db.resetDatabase();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Configure Multer for document and image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${basename}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// ==========================================
// 1. STATS & OVERVIEW API
// ==========================================
app.get('/api/stats', async (req, res) => {
  try {
    const [totalRows] = await db.query('SELECT COUNT(*) as count FROM student_data');
    const [standardRows] = await db.query('SELECT Standard, COUNT(*) as count FROM student_data GROUP BY Standard');
    const [feeStats] = await db.query('SELECT Fees_Status, COUNT(*) as count, SUM(Fees_Paid) as totalPaid FROM student_data GROUP BY Fees_Status');
    const [attendanceAvg] = await db.query('SELECT AVG(Attendance) as avgAttendance FROM student_data');
    const [usersCount] = await db.query('SELECT COUNT(*) as count FROM users');

    res.json({
      totalStudents: totalRows[0].count,
      standards: standardRows,
      feeStats,
      avgAttendance: Math.round(attendanceAvg[0]?.avgAttendance || 85),
      totalUsers: usersCount[0]?.count || 0,
      systemStatus: 'Online',
    });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack, sql: err.sql });
  }
});

// ==========================================
// 2. STUDENT SEARCH & LISTING
// ==========================================
app.get('/api/students', async (req, res) => {
  const { search, standard, section, fees, sort = 'Sr_No', order = 'ASC', page = 1, limit = 12 } = req.query;
  const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  try {
    let whereClauses = [];

    if (search && search.trim() !== '') {
      whereClauses.push(`(Name LIKE '%${search}%' OR Roll_No LIKE '%${search}%' OR Email LIKE '%${search}%')`);
    }

    if (standard && standard !== 'All') {
      whereClauses.push(`Standard = '${standard}'`);
    }

    if (section && section !== 'All') {
      whereClauses.push(`Section = '${section}'`);
    }

    if (fees && fees !== 'All') {
      whereClauses.push(`Fees_Status = '${fees}'`);
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM student_data ${whereStr}`;
    const [countResult] = await db.query(countQuery);
    const total = countResult[0]?.total || 0;

    const dataQuery = `SELECT Sr_No, Name, Standard, Section, Roll_No, Email, Phone, Gender, Fees_Status, Fees_Amount, Fees_Paid, Attendance, GPA, Remarks, Avatar FROM student_data ${whereStr} ORDER BY ${sort} ${order} LIMIT ${parseInt(limit, 10)} OFFSET ${offset}`;
    
    const [students] = await db.query(dataQuery);

    res.json({
      students,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (err) {
    res.status(500).json({
      error: 'Database Query Failed',
      sqlMessage: err.sqlMessage || err.message,
      sql: err.sql,
      code: err.code,
    });
  }
});

// ==========================================
// 3. STUDENT DETAIL
// ==========================================
app.get('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`SELECT * FROM student_data WHERE Sr_No = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Confidential student details
app.get('/api/students/:id/confidential', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`SELECT Sr_No, Name, Roll_No, Medical_History, Father_Name, Mother_Name, Emergency_Contact, Address, Fees_Paid, Fees_Amount FROM student_data WHERE Sr_No = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({
      record: rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create student record
app.post('/api/students', async (req, res) => {
  try {
    const {
      Name, Standard, Section, Roll_No, Email, Phone, Gender, DOB,
      Blood_Group, Address, Father_Name, Mother_Name, Emergency_Contact,
      Fees_Status = 'Pending', Fees_Amount = 18500, Fees_Paid = 0,
      Attendance = 85, GPA = 'A', Remarks = '', Avatar
    } = req.body;

    const studentAvatar = Avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(Name || 'Student')}`;

    const [result] = await db.query(
      `INSERT INTO student_data 
        (Name, Standard, Section, Roll_No, Email, Phone, Gender, DOB, Blood_Group, Address, Father_Name, Mother_Name, Emergency_Contact, Fees_Status, Fees_Amount, Fees_Paid, Attendance, GPA, Remarks, Avatar)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [Name, Standard, Section, Roll_No, Email, Phone, Gender, DOB, Blood_Group, Address, Father_Name, Mother_Name, Emergency_Contact, Fees_Status, Fees_Amount, Fees_Paid, Attendance, GPA, Remarks, studentAvatar]
    );

    res.status(201).json({ message: 'Student created successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message, sql: err.sql });
  }
});

// Update student record
app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const fields = req.body;
    delete fields.Sr_No;

    const keys = Object.keys(fields);
    if (keys.length === 0) {
      return res.status(400).json({ error: 'No fields provided' });
    }

    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = [...Object.values(fields), id];

    await db.query(`UPDATE student_data SET ${setClause} WHERE Sr_No = ?`, values);
    res.json({ message: 'Student details updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete student record
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM student_data WHERE Sr_No = ?', [id]);
    res.json({ message: `Student #${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. STUDENT LEDGER & ATTENDANCE
// ==========================================
app.post('/api/students/:id/pay-fees', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ error: 'Invalid payment amount' });
    }

    const [rows] = await db.query('SELECT Fees_Paid, Fees_Amount FROM student_data WHERE Sr_No = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });

    const newPaid = Number(rows[0].Fees_Paid) + parsedAmount;
    const newStatus = newPaid >= rows[0].Fees_Amount ? 'Paid' : newPaid > 0 ? 'Partial' : 'Pending';

    await db.query('UPDATE student_data SET Fees_Paid = ?, Fees_Status = ? WHERE Sr_No = ?', [newPaid, newStatus, id]);

    res.json({
      message: `Payment of ₹${parsedAmount} recorded.`,
      newBalance: newPaid,
      status: newStatus,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update attendance record
app.post('/api/students/:id/attendance', async (req, res) => {
  const { id } = req.params;
  const { attendance } = req.body;

  try {
    await db.query('UPDATE student_data SET Attendance = ? WHERE Sr_No = ?', [attendance, id]);
    res.json({ message: `Attendance updated to ${attendance}%` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. AUTHENTICATION SERVICES
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const [rows] = await db.query(query);

    if (rows.length > 0) {
      const user = rows[0];
      const tokenPayload = {
        id: user.id,
        username: user.username,
        role: user.role,
        exp: Date.now() + 24 * 60 * 60 * 1000,
      };
      const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    }

    res.status(401).json({ error: 'Invalid username or password' });
  } catch (err) {
    res.status(500).json({ error: err.message, sql: err.sql });
  }
});

// Register new user account
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password, role = 'student' } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
      [username, email, password, role]
    );

    res.status(201).json({
      message: 'User account created successfully.',
      id: result.insertId,
      role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. USER DIRECTORY
// ==========================================
app.get('/api/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, email, password, role, created_at FROM users');
    res.json({
      users,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. INSTITUTIONAL NOTICES
// ==========================================
app.get('/api/notices', async (req, res) => {
  try {
    const [notices] = await db.query('SELECT * FROM notices ORDER BY pinned DESC, id DESC');
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post announcement notice
app.post('/api/notices', async (req, res) => {
  const { title, content, category = 'General', author = 'User' } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO notices (title, content, category, author) VALUES (?, ?, ?, ?)',
      [title, content, category, author]
    );

    res.status(201).json({
      message: 'Notice posted successfully.',
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. DOCUMENT UPLOADS
// ==========================================
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    message: 'File uploaded successfully.',
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    url: fileUrl,
    directAccessUrl: `http://localhost:${PORT}${fileUrl}`,
  });
});

// ==========================================
// 9. SYSTEM DIAGNOSTIC UTILITIES
// ==========================================
app.post('/api/tools/ping', (req, res) => {
  const { host } = req.body;
  if (!host) return res.status(400).json({ error: 'Host is required' });

  const cmd = `ping -n 1 ${host}`;
  exec(cmd, { timeout: 7000 }, (error, stdout, stderr) => {
    res.json({
      command: cmd,
      output: stdout || stderr || (error ? error.message : 'No output'),
      error: error ? error.message : null,
    });
  });
});

// ==========================================
// 10. NETWORK RESOURCE PROXY
// ==========================================
app.post('/api/tools/fetch-url', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'AegisEdu-Internal-Fetcher/1.0' } });
    const contentType = response.headers.get('content-type') || '';
    let body;

    if (contentType.includes('application/json')) {
      body = await response.json();
    } else {
      body = (await response.text()).slice(0, 4000);
    }

    res.json({
      url,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch URL', message: err.message });
  }
});

// ==========================================
// 11. ENVIRONMENT CONFIGURATION & LOGS
// ==========================================
app.get('/api/debug/env', (req, res) => {
  res.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV || 'development',
      DB_HOST: process.env.DB_HOST || '127.0.0.1',
      DB_PORT: process.env.DB_PORT || '3306',
      DB_USER: process.env.DB_USER || 'root',
      DB_PASSWORD: process.env.DB_PASSWORD || 'Pass@123',
      DB_NAME: process.env.DB_NAME || 'student',
      SECRET_KEY: 'aegis_super_secret_jwt_key_do_not_share_123',
      SERVER_PATH: __dirname,
      PLATFORM: process.platform,
      NODE_VERSION: process.version,
    },
  });
});

// System activity logs
app.get('/api/admin/system-logs', async (req, res) => {
  const roleHeader = req.headers['x-user-role'];
  if (roleHeader !== 'admin') {
    return res.status(403).json({
      error: 'Access Denied: Admin role required.',
    });
  }

  try {
    const [logs] = await db.query('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50');
    res.json({
      message: 'Access granted.',
      logs: logs.length > 0 ? logs : [
        { id: 1, action: 'SYSTEM_BOOT', actor: 'SYSTEM', details: 'AegisEdu Core Engine Online', ip_address: '127.0.0.1', created_at: new Date() },
        { id: 2, action: 'AUTH_FAILURE_UNLOGGED', actor: 'Unknown', details: 'Authentication event recorded', ip_address: '192.168.1.45', created_at: new Date() }
      ],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve React production build
const clientDist = path.join(__dirname, '..', 'react', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Start Server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`AegisEdu Student Portal API running on http://localhost:${PORT}`);
  await setupDatabase();
});
