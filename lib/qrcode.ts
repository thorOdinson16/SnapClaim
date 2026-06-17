import QRCode from "qrcode";

export async function generateQRCode(labelUrl: string): Promise<Buffer> {
  return QRCode.toBuffer(labelUrl, {
    type: "png",
    width: 400,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}