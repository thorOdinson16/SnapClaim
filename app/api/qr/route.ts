import { NextRequest, NextResponse } from "next/server";
import { generateQRCode } from "@/lib/qrcode";

export async function GET(request: NextRequest) {
  const publicUrl = process.env.PUBLIC_URL;
  if (!publicUrl) {
    return new NextResponse("Missing PUBLIC_URL env var", { status: 500 });
  }

  const labelUrl = `${publicUrl}/label`;
  const buffer = await generateQRCode(labelUrl);

  // Convert Buffer to Uint8Array to satisfy BodyInit type
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}