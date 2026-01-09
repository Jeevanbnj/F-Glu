export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(req) {
  try {
    const { imagePath } = await req.json();

    const pythonScript = path.join(
      process.cwd(),
      "../glaucoma_backend/ml/predict.py"
    );

    return new Promise((resolve) => {
      exec(
        `python "${pythonScript}" "${imagePath}"`,
        (error, stdout) => {
          if (error) {
            resolve(
              NextResponse.json(
                { error: "Prediction failed" },
                { status: 500 }
              )
            );
          } else {
            const [result, confidence] = stdout.trim().split("|");

            resolve(
              NextResponse.json({
                diagnosis: result,
                confidence: Number(confidence).toFixed(2),
              })
            );
          }
        }
      );
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
