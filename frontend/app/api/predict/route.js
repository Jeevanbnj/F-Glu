export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export async function POST(req) {
  try {
    const { imagePath } = await req.json();

    if (!imagePath) {
      return NextResponse.json(
        { error: "Image path missing" },
        { status: 400 }
      );
    }

    // ✅ MATCHES /api/upload EXACTLY
    const absoluteImagePath = path.join(
      process.cwd(),
      "public",
      imagePath.replace(/^\/+/, "")
    );

    if (!fs.existsSync(absoluteImagePath)) {
      console.error("IMAGE NOT FOUND:", absoluteImagePath);
      return NextResponse.json(
        { error: "Image not found on server" },
        { status: 404 }
      );
    }

    const scriptPath = path.join(
      process.cwd(),
      "..",
      "glaucoma_backend",
      "ml",
      "predict.py"
    );

    return await new Promise((resolve) => {
      const py = spawn("python", [scriptPath, absoluteImagePath], {
        windowsHide: true,
      });

      let output = "";
      let error = "";

      py.stdout.on("data", (data) => {
        output += data.toString();
      });

      py.stderr.on("data", (data) => {
        error += data.toString();
      });

      py.on("close", (code) => {
        console.log("PYTHON STDOUT:", output);
        console.log("PYTHON STDERR:", error);
        console.log("EXIT CODE:", code);

        if (code !== 0 || !output.trim()) {
          console.error("Python error:", error);
          resolve(
            NextResponse.json(
              { error: "Prediction failed", details: error },
              { status: 500 }
            )
          );
          return;
        }

        // label|confidence|/uploads/gradcam_xxx.jpg
        const lastLine = output.trim().split("\n").pop();
        const [label, confidence, gradcamPath] = lastLine.split("|");

        resolve(
          NextResponse.json({
            diagnosis: label === "normal" ? "Normal" : "Glaucoma",
            confidence: Number(confidence),
            gradcamPath,
          })
        );
      });
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
