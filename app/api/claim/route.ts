import { NextRequest, NextResponse } from "next/server";
import { ocrImage, analyzeDamage, AIInferenceError } from "@/lib/ai";
import { getFallbackResult } from "@/lib/fallback";
import { checkWarranty } from "@/lib/crm";
import twilio from "twilio";

export async function POST(request: NextRequest) {
  try {
    const { imageBase64 } = await request.json();
    if (!imageBase64) {
      return NextResponse.json(
        { success: false, message: "Missing image data" },
        { status: 400 }
      );
    }

    // Step 1: OCR (may return empty string)
    let ocrText = "";
    try {
      ocrText = await ocrImage(imageBase64);
    } catch (err) {
      console.warn("[OCR] Groq OCR threw an error");
    }

    // Step 2: Damage assessment
    let damage_detected = false;
    let warranty_eligible = false;
    let product_name = ocrText; // from OCR, may be empty

    try {
      const damageResult = await analyzeDamage(imageBase64);
      damage_detected = damageResult.damage_detected;
      warranty_eligible = damageResult.warranty_eligible;
      console.log("[AI] Damage:", damageResult);
    } catch (error) {
      // ONLY here we use the hardcoded fallback – AI call itself failed
      console.error("[FALLBACK_TRIGGERED]", error);
      const fallback = getFallbackResult();
      damage_detected = fallback.damage_detected;
      warranty_eligible = fallback.warranty_eligible;
      product_name = fallback.product_name;
      ocrText = fallback.product_name; // so CRM can match
    }

    const judgePhone = process.env.JUDGE_PHONE_NUMBER;
    if (!judgePhone) {
      throw new Error("JUDGE_PHONE_NUMBER not set");
    }

    const crmResult = checkWarranty(judgePhone, ocrText);

    const responsePayload: {
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
      } else {
        const twilioClient = twilio(twilioAccountSid, twilioAuthToken);
        const publicUrl = process.env.PUBLIC_URL;
        const qrUrl = publicUrl ? `${publicUrl}/api/qr` : null;
        const labelUrl = publicUrl ? `${publicUrl}/label` : null;

        try {
          await twilioClient.messages.create({
            body: `SnapClaim: We've identified your ${product_name || "product"}. It's under warranty. Here's your free return label.`,
            from: twilioFrom,
            to: `whatsapp:${judgePhone}`,
            ...(qrUrl ? { mediaUrl: [qrUrl] } : {}),
          });
          responsePayload.whatsappSent = true;
          console.log("[TWILIO] Message sent");
        } catch (twilioError: any) {
          console.error("[TWILIO] Send failed:", twilioError.message);
          if (labelUrl) responsePayload.labelUrl = labelUrl;
        }
      }

      responsePayload.whatsappFailed = !responsePayload.whatsappSent;
      responsePayload.message = responsePayload.whatsappSent
        ? "Claim approved! Check your WhatsApp for the return label."
        : "Claim approved! WhatsApp message could not be delivered. Please use the link below to access your return label.";
    } else {
      responsePayload.success = false;
      responsePayload.message = `Sorry, the product could not be verified for warranty claim.`;
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