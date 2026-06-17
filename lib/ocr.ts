import Tesseract from 'tesseract.js';

export async function extractText(base64Image: string): Promise<string> {
  const { data } = await Tesseract.recognize(
    Buffer.from(base64Image, 'base64'),
    'eng',
    {
      logger: () => {}, // silent
    }
  );
  return data.text;
}

export function findModelName(ocrText: string, crmProduct: string): boolean {
  // Extract individual words from OCR output
  const ocrWords = ocrText.toLowerCase().split(/\s+/);
  
  // Extract words from CRM product name
  const crmWords = crmProduct.toLowerCase().split(/\s+/);
  
  // Count how many CRM words appear in OCR text
  const matchedWords = crmWords.filter(word => 
    ocrWords.some(ocrWord => ocrWord.includes(word) || word.includes(ocrWord))
  );
  
  // Require at least 2 matching words (handles "Model X Keyboard")
  return matchedWords.length >= 2;
}