import { DatabaseSync } from 'node:sqlite';
import mysql from 'mysql2/promise';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, 'student.db');
const requestedEngine = (process.env.DB_ENGINE || 'sqlite').toLowerCase();

let mysqlPool = null;
let sqliteDb = null;
let activeEngine = 'sqlite';

// Initialize SQLite database instance and schema
function initSqlite() {
  const isNewDb = !fs.existsSync(dbFile);
  sqliteDb = new DatabaseSync(dbFile);
  sqliteDb.exec('PRAGMA journal_mode = WAL;');
  sqliteDb.exec('PRAGMA foreign_keys = ON;');

  // Create tables
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS student_data (
      Sr_No INTEGER PRIMARY KEY AUTOINCREMENT,
      Name TEXT NOT NULL,
      Standard TEXT NOT NULL,
      Section TEXT NOT NULL DEFAULT 'A',
      Roll_No TEXT NOT NULL,
      Email TEXT,
      Phone TEXT,
      Gender TEXT DEFAULT 'Other',
      DOB TEXT,
      Blood_Group TEXT,
      Address TEXT,
      Father_Name TEXT,
      Mother_Name TEXT,
      Emergency_Contact TEXT,
      Medical_History TEXT,
      Fees_Status TEXT DEFAULT 'Pending',
      Fees_Amount REAL DEFAULT 18500.00,
      Fees_Paid REAL DEFAULT 0.00,
      Attendance INTEGER DEFAULT 85,
      GPA TEXT DEFAULT 'A',
      Remarks TEXT,
      Avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      author TEXT DEFAULT 'Administration',
      pinned INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      actor TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      created_at TEXT DEFAULT (datetime('now', 'localtime'))
    );
  `);

  // Check if student_data is empty, seed initial data
  const countStmt = sqliteDb.prepare('SELECT COUNT(*) as count FROM student_data');
  const countResult = countStmt.all();
  if (countResult[0]?.count === 0) {
    seedInitialData();
  }
}

// Seed comprehensive realistic sample records
function seedInitialData() {
  const insertUser = sqliteDb.prepare(`
    INSERT OR IGNORE INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)
  `);
  insertUser.run(1, 'admin', 'admin@aegisedu.ac.in', 'Admin@2026', 'admin');
  insertUser.run(2, 'teacher_sharma', 'sharma@aegisedu.ac.in', 'Teacher@123', 'teacher');
  insertUser.run(3, 'student_aarav', 'aarav.patel@student.edu', 'Student@123', 'student');

  const insertStudent = sqliteDb.prepare(`
    INSERT INTO student_data 
    (Name, Standard, Section, Roll_No, Email, Phone, Gender, DOB, Blood_Group, Address, Father_Name, Mother_Name, Emergency_Contact, Fees_Status, Fees_Amount, Fees_Paid, Attendance, GPA, Remarks, Avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialStudents = [
    ['Aarav Patel', '10th', 'A', '10A-01', 'aarav.patel@student.edu', '+91 98201 12345', 'Male', '2009-03-15', 'B+', 'Flat 402, Shivam Apts, Shivaji Nagar, Pune', 'Ramesh Patel', 'Geeta Patel', '+91 98201 11111', 'Paid', 25000, 25000, 96, 'A+', 'Consistently top of class in Mathematics.', 'https://api.dicebear.com/7.x/bottts/svg?seed=AaravPatel'],
    ['Priya Deshmukh', '10th', 'A', '10A-02', 'priya.deshmukh@student.edu', '+91 98202 23456', 'Female', '2009-07-22', 'O+', 'Plot 18, Mayur Colony, Kothrud, Pune', 'Anil Deshmukh', 'Sunita Deshmukh', '+91 98202 22222', 'Partial', 25000, 15000, 91, 'A', 'Active in science exhibitions and debate club.', 'https://api.dicebear.com/7.x/bottts/svg?seed=PriyaDeshmukh'],
    ['Rohan Kulkarni', '10th', 'B', '10B-08', 'rohan.k@student.edu', '+91 98203 34567', 'Male', '2009-11-05', 'A+', 'Row House 5, Baner Road, Pune', 'Sachin Kulkarni', 'Meena Kulkarni', '+91 98203 33333', 'Pending', 25000, 0, 82, 'B+', 'Good potential in athletics; needs focus in chemistry.', 'https://api.dicebear.com/7.x/bottts/svg?seed=RohanKulkarni'],
    ['Ananya Iyer', '11th', 'A', '11A-04', 'ananya.iyer@student.edu', '+91 98204 45678', 'Female', '2008-01-18', 'AB+', '44 Green Acres, Viman Nagar, Pune', 'Subramanian Iyer', 'Lakshmi Iyer', '+91 98204 44444', 'Paid', 28000, 28000, 98, 'A+', 'National Olympiad finalist in Physics.', 'https://api.dicebear.com/7.x/bottts/svg?seed=AnanyaIyer'],
    ['Vihaan Shinde', '11th', 'B', '11B-12', 'vihaan.s@student.edu', '+91 98205 56789', 'Male', '2008-09-30', 'O-', 'B-12, Ganga Heights, Hadapsar, Pune', 'Ganesh Shinde', 'Rekha Shinde', '+91 98205 55555', 'Partial', 28000, 14000, 85, 'B', 'Shows steady improvement in computer science.', 'https://api.dicebear.com/7.x/bottts/svg?seed=VihaanShinde'],
    ['Sneha Joshi', '12th', 'A', '12A-03', 'sneha.joshi@student.edu', '+91 98206 67890', 'Female', '2007-05-12', 'B+', 'C-301, Silver Oak, Aundh, Pune', 'Milind Joshi', 'Swati Joshi', '+91 98206 66666', 'Paid', 32000, 32000, 95, 'A+', 'Head girl and captain of girls basketball team.', 'https://api.dicebear.com/7.x/bottts/svg?seed=SnehaJoshi'],
    ['Kabir Mehta', '12th', 'B', '12B-09', 'kabir.mehta@student.edu', '+91 98207 78901', 'Male', '2007-08-25', 'A-', '77 Hermes Heritage, Shastri Nagar, Pune', 'Pankaj Mehta', 'Deepa Mehta', '+91 98207 77777', 'Pending', 32000, 5000, 79, 'C+', 'Needs remedial sessions before board exams.', 'https://api.dicebear.com/7.x/bottts/svg?seed=KabirMehta'],
    ['Tanvi Sawant', '9th', 'A', '09A-15', 'tanvi.sawant@student.edu', '+91 98208 89012', 'Female', '2010-04-10', 'O+', '8 Royal Palms, Koregaon Park, Pune', 'Vijay Sawant', 'Pooja Sawant', '+91 98208 88888', 'Paid', 22000, 22000, 93, 'A', 'Talented artist, participated in state art contest.', 'https://api.dicebear.com/7.x/bottts/svg?seed=TanviSawant'],
    ['Aditya Rao', '9th', 'B', '09B-07', 'aditya.rao@student.edu', '+91 98209 90123', 'Male', '2010-12-01', 'B-', '503 Blue Ridge, Hinjewadi, Pune', 'Narayana Rao', 'Savitri Rao', '+91 98209 99999', 'Partial', 22000, 11000, 88, 'B+', 'Enthusiastic robotics lab team member.', 'https://api.dicebear.com/7.x/bottts/svg?seed=AdityaRao'],
    ['Isha More', '10th', 'C', '10C-11', 'isha.more@student.edu', '+91 98210 01234', 'Female', '2009-10-19', 'A+', '21 Anand Park, Wadgaon Sheri, Pune', 'Devendra More', 'Kavita More', '+91 98210 00000', 'Paid', 25000, 25000, 97, 'A+', 'Consistent 100% attendance throughout term.', 'https://api.dicebear.com/7.x/bottts/svg?seed=IshaMore']
  ];

  for (const st of initialStudents) {
    insertStudent.run(...st);
  }

  const insertNotice = sqliteDb.prepare(`
    INSERT INTO notices (title, content, category, author, pinned) VALUES (?, ?, ?, ?, ?)
  `);
  insertNotice.run(
    'Mid-Term Examination Schedule Announced',
    'The official Mid-Term examination timetable for Standards 9 through 12 is published on the portal. Morning sessions commence at 09:00 AM IST sharp.',
    'Academic',
    'Dean of Academics',
    1
  );
  insertNotice.run(
    'Annual Inter-School Sports Meet 2026',
    'Registrations are open for track, field, football, and badminton events. Eligible students must submit parent consent forms by Friday.',
    'Events',
    'Sports Department',
    0
  );
  insertNotice.run(
    'Fee Clearance Notice for Term 2',
    'Parents and guardians are kindly requested to clear pending academic fee installments before the deadline to ensure uninterrupted portal access.',
    'Finance',
    'Accounts Office',
    1
  );

  const insertLog = sqliteDb.prepare(`
    INSERT INTO audit_logs (action, actor, details, ip_address) VALUES (?, ?, ?, ?)
  `);
  insertLog.run('SYSTEM_INIT', 'SYSTEM', 'AegisEdu SQLite Database initialized with sample student dossiers.', '127.0.0.1');
}

// Initialize database
export async function setupDatabase() {
  if (requestedEngine === 'mysql') {
    try {
      mysqlPool = mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Pass@123',
        database: process.env.DB_NAME || 'student',
        waitForConnections: true,
        connectionLimit: 15,
        queueLimit: 0,
      });

      const conn = await mysqlPool.getConnection();
      conn.release();
      activeEngine = 'mysql';
      console.log(`✅ [Database] Connected successfully to MySQL (${process.env.DB_HOST}:${process.env.DB_PORT}, DB: ${process.env.DB_NAME})`);
      return;
    } catch (err) {
      console.warn(`⚠️ [MySQL Unavailable] ${err.message}. Seamlessly switching to native SQLite (${dbFile})`);
    }
  }

  // Use SQLite
  initSqlite();
  activeEngine = 'sqlite';
  console.log(`✅ [Database] Native SQLite active (${dbFile}) - Zero installation, no admin rights required.`);
}

// Unified query method compatible with mysql2/promise: returns [rows, fields]
export const db = {
  async query(sql, params = []) {
    if (activeEngine === 'mysql' && mysqlPool) {
      return await mysqlPool.query(sql, params);
    }

    if (!sqliteDb) {
      initSqlite();
    }

    const trimmed = (sql || '').trim();
    const upper = trimmed.toUpperCase();
    const cleanParams = (Array.isArray(params) ? params : [params]).map((p) => (p === undefined ? null : p));

    if (upper.startsWith('SELECT') || upper.startsWith('PRAGMA') || upper.startsWith('EXPLAIN')) {
      const stmt = sqliteDb.prepare(trimmed);
      const rows = stmt.all(...cleanParams);
      return [rows, []];
    } else {
      const stmt = sqliteDb.prepare(trimmed);
      const result = stmt.run(...cleanParams);
      return [{ insertId: Number(result.lastInsertRowid), affectedRows: result.changes }, []];
    }
  },

  async getConnection() {
    if (activeEngine === 'mysql' && mysqlPool) {
      return await mysqlPool.getConnection();
    }
    return {
      query: this.query.bind(this),
      release: () => {},
    };
  },

  getEngine() {
    return activeEngine;
  },

  getDbFilePath() {
    return dbFile;
  },

  // Database Management Helpers for Web DB Manager
  getTables() {
    if (!sqliteDb) initSqlite();
    const tables = sqliteDb.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;
    `).all();

    return tables.map((t) => {
      const count = sqliteDb.prepare(`SELECT COUNT(*) as count FROM "${t.name}"`).all()[0]?.count || 0;
      const columns = sqliteDb.prepare(`PRAGMA table_info("${t.name}")`).all();
      return {
        name: t.name,
        rowCount: count,
        columns: columns.map((c) => ({
          cid: c.cid,
          name: c.name,
          type: c.type,
          notnull: c.notnull === 1,
          dflt_value: c.dflt_value,
          pk: c.pk === 1,
        })),
      };
    });
  },

  getTableData(tableName, limit = 50, offset = 0, sortBy = null, order = 'ASC') {
    if (!sqliteDb) initSqlite();

    // Validate table name to avoid injection
    const tables = sqliteDb.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name = ?`).all(tableName);
    if (tables.length === 0) {
      throw new Error(`Table "${tableName}" does not exist`);
    }

    const total = sqliteDb.prepare(`SELECT COUNT(*) as count FROM "${tableName}"`).all()[0]?.count || 0;
    const orderClause = sortBy ? `ORDER BY "${sortBy}" ${order === 'DESC' ? 'DESC' : 'ASC'}` : '';
    const rows = sqliteDb.prepare(`SELECT * FROM "${tableName}" ${orderClause} LIMIT ? OFFSET ?`).all(limit, offset);

    return {
      tableName,
      total,
      limit,
      offset,
      rows,
    };
  },

  executeCustomSql(sql) {
    if (!sqliteDb) initSqlite();
    const trimmed = (sql || '').trim();
    if (!trimmed) throw new Error('SQL query cannot be empty');

    const upper = trimmed.toUpperCase();
    if (upper.startsWith('SELECT') || upper.startsWith('PRAGMA') || upper.startsWith('EXPLAIN')) {
      const stmt = sqliteDb.prepare(trimmed);
      const rows = stmt.all();
      return { type: 'select', rows, rowCount: rows.length };
    } else {
      sqliteDb.exec(trimmed);
      return { type: 'exec', message: 'Executed successfully' };
    }
  },

  resetDatabase() {
    if (!sqliteDb) initSqlite();
    sqliteDb.exec(`
      DROP TABLE IF EXISTS student_data;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS notices;
      DROP TABLE IF EXISTS audit_logs;
    `);
    initSqlite();
    return { message: 'Database reset and re-seeded successfully' };
  },
};
