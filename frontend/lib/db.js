import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";

let db;
const dbPath = path.join(process.cwd(), "database.db");

export async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: () =>
      path.join(process.cwd(), "public", "sql-wasm.wasm"),
  });

  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(filebuffer);

    // Check if records table exists, create if not
    try {
      const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='records'");
      if (!tables.length) {
        db.run(`
          CREATE TABLE records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patientId TEXT,
            patientName TEXT,
            eye TEXT,
            diagnosis TEXT,
            confidence REAL,
            fundusImagePath TEXT,
            gradcamImagePath TEXT,
            notes TEXT,
            doctorEmail TEXT,
            createdAt TEXT DEFAULT (datetime('now'))
          )
        `);
        saveDb();
      } else {
        // Add doctorEmail column if it doesn't exist
        try {
          db.exec("SELECT doctorEmail FROM records LIMIT 1");
        } catch (err) {
          // Column doesn't exist, add it
          db.run("ALTER TABLE records ADD COLUMN doctorEmail TEXT");
          saveDb();
        }
      }
    } catch (err) {
      console.error("Error checking/creating records table:", err);
    }

    // Add doctorEmail column to patients table if it doesn't exist
    try {
      db.exec("SELECT doctorEmail FROM patients LIMIT 1");
    } catch (err) {
      // Column doesn't exist, add it
      try {
        db.run("ALTER TABLE patients ADD COLUMN doctorEmail TEXT");
        saveDb();
      } catch (alterErr) {
        console.error("Error adding doctorEmail to patients table:", alterErr);
      }
    }
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id TEXT UNIQUE,
        name TEXT,
        age INTEGER,
        gender TEXT,
        eye TEXT,
        iop TEXT,
        cdr TEXT,
        symptoms TEXT,
        image_path TEXT,
        doctorEmail TEXT,
        created_at TEXT
      )
    `);
    db.run(`
      CREATE TABLE records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientId TEXT,
        patientName TEXT,
        eye TEXT,
        diagnosis TEXT,
        confidence REAL,
        fundusImagePath TEXT,
        gradcamImagePath TEXT,
        notes TEXT,
        doctorEmail TEXT,
        createdAt TEXT DEFAULT (datetime('now'))
      )
    `);
    saveDb();
  }

  return db;
}


export function saveDb() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}
