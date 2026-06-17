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
 */
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Check if a CRM word can be matched by a sequence of OCR words,
 * with tolerance for single-character differences on short words.
 */
function canMatchCrmWord(
  crmWord: string,
  ocrWords: string[],
  startIdx: number
): { matched: boolean; consumed: number } {
  // Try concatenating up to 3 consecutive OCR words to match the CRM word
  for (let len = 1; len <= 3 && startIdx + len <= ocrWords.length; len++) {
    const candidate = ocrWords.slice(startIdx, startIdx + len).join("");
    // Exact match
    if (candidate === crmWord) {
      return { matched: true, consumed: len };
    }
    // For short CRM words (≤2 chars), allow 1‑character difference
    if (crmWord.length <= 2 && candidate.length <= 2 && levenshtein(candidate, crmWord) <= 1) {
      return { matched: true, consumed: len };
    }
    // For longer words, allow if they share the same start and end and length is close
    if (
      crmWord.length > 2 &&
      Math.abs(candidate.length - crmWord.length) <= 1 &&
      candidate[0] === crmWord[0] &&
      candidate[candidate.length - 1] === crmWord[crmWord.length - 1]
    ) {
      return { matched: true, consumed: len };
    }
  }
  return { matched: false, consumed: 0 };
}

export function checkWarranty(
  phone: string,
  ocrText: string
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
  const crmWords = normalize(customer.registeredProduct).split(/\s+/);
  const ocrWords = normalize(ocrText).split(/\s+/);

  // Try to match each CRM word sequentially against the OCR words
  let ocrIdx = 0;
  let allMatched = true;
  for (const crmWord of crmWords) {
    if (ocrIdx >= ocrWords.length) {
      allMatched = false;
      break;
    }
    const { matched, consumed } = canMatchCrmWord(crmWord, ocrWords, ocrIdx);
    if (!matched) {
      allMatched = false;
      break;
    }
    ocrIdx += consumed;
  }

  // Also ensure we consumed all OCR words (or at least no extra unrelated words)
  const productMatch = allMatched && ocrIdx === ocrWords.length;

  console.log(
    `[CRM] OCR words: ${ocrWords}, CRM words: ${crmWords}, matched: ${productMatch}`
  );

  const warrantyValid = !customer.warrantyExpired;

  return {
    approved: productMatch && warrantyValid,
    customerName: customer.name,
  };
}