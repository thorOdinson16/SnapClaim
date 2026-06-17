import Tesseract from 'tesseract.js';

/**
 * Client-side OCR using Tesseract.js.
 * Accepts a pure base64 string (no data URL prefix).
 */
export async function extractTextFromImage(base64Image: string): Promise<string> {
  const { data } = await Tesseract.recognize(
    `data:image/jpeg;base64,${base64Image}`,
    'eng',
    {
      logger: (m) => console.log('[OCR]', m),
    }
  );
  return data.text;
}