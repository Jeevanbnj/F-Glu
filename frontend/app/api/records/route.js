export const runtime = "nodejs";

import { getDb, saveDb } from "@/lib/db";

/* =========================
   GET ALL RECORDS
   ========================= */
export async function GET() {
  try {
    const db = await getDb();
    const result = db.exec("SELECT * FROM records ORDER BY createdAt DESC");

    if (!result.length) return Response.json([]);

    const columns = result[0].columns;
    const values = result[0].values;

    const records = values.map((row) =>
      Object.fromEntries(
        row.map((value, index) => [columns[index], value])
      )
    );

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
    } = body;

    if (!patientId || !diagnosis || confidence === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    db.run(
      `
      INSERT INTO records
      (patientId, patientName, eye, diagnosis, confidence, fundusImagePath, gradcamImagePath, notes, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
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
