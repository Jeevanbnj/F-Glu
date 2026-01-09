import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(req, { params }) {
  const db = await getDB();
  const patient = await db.get(
    "SELECT * FROM patients WHERE id = ?",
    params.id
  );

  return NextResponse.json(patient);
}
