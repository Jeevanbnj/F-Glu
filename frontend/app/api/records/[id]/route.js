export const runtime = "nodejs";

import { getDb } from "@/lib/db";

/* =========================
   GET SINGLE RECORD BY ID
   ========================= */
export async function GET(req, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Record ID is required" }),
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // sql.js exec with parameter sanitization
    const sanitizedId = parseInt(id, 10);
    if (isNaN(sanitizedId)) {
      return new Response(
        JSON.stringify({ error: "Invalid record ID" }),
        { status: 400 }
      );
    }

    const result = db.exec(`SELECT * FROM records WHERE id = ${sanitizedId}`);
    
    if (!result.length || !result[0].values.length) {
      return new Response(
        JSON.stringify({ error: "Record not found" }),
        { status: 404 }
      );
    }

    const columns = result[0].columns;
    const row = result[0].values[0];
    const record = Object.fromEntries(
      row.map((value, index) => [columns[index], value])
    );

    return Response.json(record);
  } catch (error) {
    console.error("Error fetching record:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}
