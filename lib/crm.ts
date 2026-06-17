import fs from "fs";
import path from "path";

interface Customer {
  phone: string;
  name: string;
  registeredProduct: string;
  purchaseDate: string;
  warrantyYears: number;
  warrantyExpired: boolean;
}

export function checkWarranty(
  phone: string,
  productName: string,
  ocrText?: string
): { approved: boolean; customerName: string } {
  const filePath = path.join(process.cwd(), "data", "mockCRM.json");
  if (!fs.existsSync(filePath)) {
    console.error("[CRM] mockCRM.json not found");
    return { approved: false, customerName: "" };
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const crmData = JSON.parse(raw);
  const customer = crmData.customers.find(
    (c: Customer) => c.phone === phone
  );

  if (!customer) {
    return { approved: false, customerName: "" };
  }

  // Simple matching — if OCR text is available, check if CRM product words appear
  let productMatch = false;
  
  if (ocrText) {
    const ocrLower = ocrText.toLowerCase();
    const crmWords = customer.registeredProduct.toLowerCase().split(/\s+/);
    const matchedWords = crmWords.filter((word: string) => ocrLower.includes(word));
    productMatch = matchedWords.length >= 2; // "model" + "keyboard" at minimum
    console.log(`[CRM] OCR match: ${matchedWords.length}/${crmWords.length} words matched`);
  } else {
    // Fallback to basic string comparison
    const normalize = (str: string) => str.trim().toLowerCase();
    productMatch = normalize(customer.registeredProduct) === normalize(productName);
  }

  const warrantyValid = !customer.warrantyExpired;

  return {
    approved: productMatch && warrantyValid,
    customerName: customer.name,
  };
}