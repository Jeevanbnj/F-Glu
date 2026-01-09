import { getDb, saveDb } from "@/lib/db";

export async function POST(req) {
  try {
    const { patientId, imagePath } = await req.json();
    const db = await getDb();

    db.run(
      `
      UPDATE patients
      SET image_path = ?
      WHERE patient_id = ?
      `,
      [imagePath, patientId]
    );

    saveDb();

    return Response.json({ success: true });
  } catch (err) {
    console.error("Link image error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to link image" }),
      { status: 500 }
    );
  }
}
