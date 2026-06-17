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

  const normalize = (str: string) => str.trim().toLowerCase();
  const crmWords = customer.registeredProduct.toLowerCase().split(/\s+/);

  // Score from AI product name
  const aiWords = normalize(productName).split(/\s+/);
  const aiScore = crmWords.filter(w => aiWords.includes(w)).length;

  // Score from OCR text (if available)
  let ocrScore = 0;
  if (ocrText) {
    const ocrLower = ocrText.toLowerCase();
    ocrScore = crmWords.filter(w => ocrLower.indexOf(w) !== -1).length;
  }

  // Use the best score
  const bestScore = Math.max(aiScore, ocrScore);
  const productMatch = bestScore >= 2; // at least "model" + "keyboard"

  console.log(`[CRM] AI score: ${aiScore}, OCR score: ${ocrScore} -> match: ${productMatch}`);

  const warrantyValid = !customer.warrantyExpired;

  return {
    approved: productMatch && warrantyValid,
    customerName: customer.name,
  };
}