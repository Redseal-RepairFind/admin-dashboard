import { s3Client } from "@/lib/aws/aws-client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    const uploadPromises = files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `file-${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
          Key: filename,
          Body: buffer,
          ContentType: file.type,
        })
      );

      return {
        filename,
        type: file.type,
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
