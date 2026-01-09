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

    // 🔥 ADD COLUMN IF MISSING (SAFE)
   
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
        created_at TEXT
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
