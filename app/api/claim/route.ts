import { NextRequest, NextResponse } from "next/server";
import { analyzeImage, AIInferenceError } from "@/lib/ai";
import { getFallbackResult } from "@/lib/fallback";
import { checkWarranty } from "@/lib/crm";
import twilio from "twilio";

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, ocrText } = await request.json();
    if (!imageBase64) {
      return NextResponse.json(
        { success: false, message: "Missing image data" },
        { status: 400 }
      );
    }

    const resizedBase64 = imageBase64;

    let product_name: string;
    let damage_detected: boolean;
    let warranty_eligible: boolean;

    try {
      const aiResult = await analyzeImage(resizedBase64);
      product_name = aiResult.product_name;
      damage_detected = aiResult.damage_detected;
      warranty_eligible = aiResult.warranty_eligible;
      console.log("[AI_PATH] AI succeeded", aiResult);
    } catch (error) {
      console.error("[FALLBACK_TRIGGERED]", error);
      const fallback = getFallbackResult();
      product_name = fallback.product_name;
      damage_detected = fallback.damage_detected;
      warranty_eligible = fallback.warranty_eligible;
    }

    const judgePhone = process.env.JUDGE_PHONE_NUMBER;
    if (!judgePhone) {
      throw new Error("JUDGE_PHONE_NUMBER not set");
    }

    const crmResult = checkWarranty(judgePhone, product_name, ocrText);

    let responsePayload: {
      success: boolean;
      message: string;
      whatsappSent: boolean;
      whatsappFailed?: boolean;
      labelUrl?: string;
    } = {
      success: true,
      message: "Claim processed",
      whatsappSent: false,
    };

    if (crmResult.approved) {
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioFrom = process.env.TWILIO_WHATSAPP_FROM;

      if (!twilioAccountSid || !twilioAuthToken || !twilioFrom) {
        console.error("[TWILIO] Missing credentials");
        responsePayload.whatsappSent = false;
      } else {
        const twilioClient = twilio(twilioAccountSid, twilioAuthToken);
        const publicUrl = process.env.PUBLIC_URL;
        const qrUrl = publicUrl ? `${publicUrl}/api/qr` : null;
        const labelUrl = publicUrl ? `${publicUrl}/label` : null;

        const messageBody = `SnapClaim: We've identified your ${product_name}. It's under warranty. Here's your free return label.`;

        try {
          await twilioClient.messages.create({
            body: messageBody,
            from: twilioFrom,
            to: `whatsapp:${judgePhone}`,
            ...(qrUrl ? { mediaUrl: [qrUrl] } : {}),
          });
          responsePayload.whatsappSent = true;
          console.log("[TWILIO] Message sent");
        } catch (twilioError: any) {
          console.error("[TWILIO] Send failed:", twilioError.message);
          responsePayload.whatsappSent = false;
          if (labelUrl) responsePayload.labelUrl = labelUrl;
        }
      }

      responsePayload.whatsappFailed = !responsePayload.whatsappSent;
      responsePayload.message = responsePayload.whatsappSent
        ? "Claim approved! Check your WhatsApp for the return label."
        : "Claim approved! WhatsApp message could not be delivered. Please use the link below to access your return label.";
    } else {
      responsePayload.success = false;
      responsePayload.message = `Sorry, your ${product_name} is not eligible for warranty claim.`;
      return NextResponse.json(responsePayload, { status: 200 });
    }

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error("[CLAIM] Fatal error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}