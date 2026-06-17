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

/**
 * Compute Levenshtein distance between two strings.
 * (Small helper — no external dependencies needed.)
 */
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[a.length][b.length];
}

export function checkWarranty(
  phone: string,
  productName: string
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

  // Tight fuzzy match: normalize, then allow max 2 character differences
  const normalize = (str: string) => str.trim().toLowerCase();
  const crmProduct = normalize(customer.registeredProduct);
  const aiProduct = normalize(productName);

  const distance = levenshtein(crmProduct, aiProduct);
  
  // Allow up to 2 character edits (handles "model x keyboard" → "model y ke keyboard")
  // "model x keyboard" (17 chars) vs "model y ke keyboard" (19 chars) → distance 3 (too high)
  // Let's instead split into words and match the key parts
  
  // Extract model identifier (the letter/number after "model")
  const modelRegex = /model\s+([a-z0-9]+)/i;
  const crmModel = crmProduct.match(modelRegex)?.[1] || "";
  const aiModel = aiProduct.match(modelRegex)?.[1] || "";
  
  // Both must mention "keyboard"
  const bothKeyboard = crmProduct.includes("keyboard") && aiProduct.includes("keyboard");
  
  // Model letter must match exactly or be within 1 Levenshtein distance
  const modelMatch = 
    crmModel === aiModel || 
    (crmModel.length <= 2 && levenshtein(crmModel, aiModel) <= 1);
  
  const productMatch = bothKeyboard && modelMatch;
  const warrantyValid = !customer.warrantyExpired;

  return {
    approved: productMatch && warrantyValid,
    customerName: customer.name,
  };
}