export const runtime = "nodejs";

import { getDb, saveDb } from "@/lib/db";

/* =========================
   GET ALL PATIENTS
   ========================= */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorEmail = searchParams.get("doctorEmail");

    if (!doctorEmail) {
      return new Response(
        JSON.stringify({ error: "doctorEmail is required" }),
        { status: 400 }
      );
    }

    const db = await getDb();
    // Filter by doctorEmail using prepared statement for security
    const stmt = db.prepare("SELECT * FROM patients WHERE doctorEmail = ?");
    stmt.bind([doctorEmail]);
    
    const patients = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      patients.push(row);
    }
    stmt.free();
    
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
      doctorEmail,
    } = body;

    if (!doctorEmail) {
      return new Response(
        JSON.stringify({ error: "doctorEmail is required" }),
        { status: 400 }
      );
    }

    db.run(
      `
      INSERT INTO patients
      (patient_id, name, age, gender, eye, iop, cdr, symptoms, doctorEmail, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
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
        doctorEmail,
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
