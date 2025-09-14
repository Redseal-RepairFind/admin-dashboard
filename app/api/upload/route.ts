import { s3Client } from "@/lib/aws/aws-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

function sanitizeFilename(originalName: string): string {
  const name = originalName
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-zA-Z0-9.\-_]/g, ""); // Remove unsupported characters
  return `file-${Date.now()}-${name}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files uploaded" },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = sanitizeFilename(file.name);

      try {
        await s3Client.send(
          new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
            Key: filename,
            Body: buffer,
            ContentType: file.type || "application/octet-stream",
          })
        );

        return {
          filename,
          type: file.type,
        };
      } catch (error: any) {
        console.error(`Error uploading file ${file.name}:`, error);
        throw new Error(`Failed to upload ${file.name}`);
      }
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
