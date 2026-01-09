export const runtime = "nodejs";

import { getDb, saveDb } from "@/lib/db";

/* =========================
   GET ALL PATIENTS
   ========================= */
export async function GET() {
  try {
    const db = await getDb();
    const result = db.exec("SELECT * FROM patients");

    // sql.js returns rows in a special format
    if (!result.length) return Response.json([]);

    const columns = result[0].columns;
    const values = result[0].values;

    const patients = values.map((row) =>
      Object.fromEntries(
        row.map((value, index) => [columns[index], value])
      )
    );

    return Response.json(patients);
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

/* =========================
   CREATE NEW PATIENT
   ========================= */
export async function POST(req) {
  try {
    const body = await req.json();
    const db = await getDb();

    const {
      patientId,
      name,
      age,
      gender,
      eye,
      iop,
      cdr,
      symptoms,
    } = body;

    db.run(
      `
      INSERT INTO patients
      (patient_id, name, age, gender, eye, iop, cdr, symptoms, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `,
      [
        patientId,
        name,
        age,
        gender,
        eye,
        iop,
        cdr,
        symptoms,
      ]
    );

    saveDb();

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
