export const runtime = "nodejs";

import { getDb, saveDb } from "@/lib/db";

/* =========================
   GET ALL RECORDS
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
    const stmt = db.prepare("SELECT * FROM records WHERE doctorEmail = ? ORDER BY createdAt DESC");
    stmt.bind([doctorEmail]);
    
    const records = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      records.push(row);
    }
    stmt.free();

    return Response.json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}

/* =========================
   CREATE NEW RECORD
   ========================= */
export async function POST(req) {
  try {
    const body = await req.json();
    const db = await getDb();

    const {
      patientId,
      patientName,
      eye,
      diagnosis,
      confidence,
      fundusImagePath,
      gradcamImagePath,
      notes = "",
      doctorEmail,
    } = body;

    if (!patientId || !diagnosis || confidence === undefined || !doctorEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required fields (patientId, diagnosis, confidence, doctorEmail)" }),
        { status: 400 }
      );
    }

    db.run(
      `
      INSERT INTO records
      (patientId, patientName, eye, diagnosis, confidence, fundusImagePath, gradcamImagePath, notes, doctorEmail, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `,
      [
        patientId,
        patientName || "",
        eye || "",
        diagnosis,
        confidence,
        fundusImagePath || "",
        gradcamImagePath || "",
        notes || "",
        doctorEmail,
      ]
    );

    saveDb();

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error creating record:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
