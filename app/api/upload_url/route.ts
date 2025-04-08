import { s3Client } from "@/lib/aws/aws-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function sanitizeFilename(originalName: string): string {
  const name = originalName
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-zA-Z0-9.\-_]/g, ""); // Remove unsupported characters
  return `file-${Date.now()}-${name}`;
}

export async function POST(req: Request) {
  try {
    const { files } = await req.json(); // files: [{ filename, fileType }]
    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    const urls = await Promise.all(
      files.map(async ({ filename, fileType }) => {
        const key = sanitizeFilename(filename);

        // Generate a presigned URL with 15-minute expiration
        const command = new PutObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
          Key: key,
          ContentType: fileType,
          ACL: "public-read", // Optional, use if files need to be public after upload
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });

        return {
          filename,
          key,
          url,
          publicUrl: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}.s3.amazonaws.com/${key}`,
        };
      })
    );

    return NextResponse.json({ success: true, urls });
  } catch (err: any) {
    console.error("Presign error", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
