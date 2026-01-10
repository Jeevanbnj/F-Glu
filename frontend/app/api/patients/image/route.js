import { getDb, saveDb } from "@/lib/db";

export async function POST(req) {
  try {
    const { patientId, imagePath, doctorEmail } = await req.json();
    
    if (!doctorEmail) {
      return new Response(
        JSON.stringify({ error: "doctorEmail is required" }),
        { status: 400 }
      );
    }

    const db = await getDb();

    // Update only if patient belongs to the doctor
    db.run(
      `UPDATE patients SET image_path = ? WHERE patient_id = ? AND doctorEmail = ?`,
      [imagePath, patientId, doctorEmail]
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
