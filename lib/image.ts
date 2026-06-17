import { extractTextFromImage } from './ocr';

const MAX_DIMENSION = 512;

/**
 * Resize an image file so its longest side is ≤512px,
 * maintaining aspect ratio, and export as pure base64 string (no data URL prefix).
 */
export function processImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const { width, height } = calculateDimensions(img.width, img.height);
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not create canvas context'));
            return;
          }

          if (img.width > MAX_DIMENSION * 2 || img.height > MAX_DIMENSION * 2) {
            stepDownResize(img, canvas, ctx, width, height);
          } else {
            ctx.drawImage(img, 0, 0, width, height);
          }

          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          const base64 = dataUrl.split(',')[1] || dataUrl;
          resolve(base64);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Process image and also extract OCR text client-side.
 */
export async function processImageWithOCR(file: File): Promise<{ base64: string; ocrText: string }> {
  const base64 = await processImage(file);
  let ocrText = '';
  try {
    ocrText = await extractTextFromImage(base64);
    console.log('[OCR] Client-side:', ocrText);
  } catch (err) {
    console.warn('[OCR] Client-side failed:', err);
  }
  return { base64, ocrText };
}

function calculateDimensions(origW: number, origH: number) {
  if (origW <= MAX_DIMENSION && origH <= MAX_DIMENSION) {
    return { width: origW, height: origH };
  }
  const scale = MAX_DIMENSION / Math.max(origW, origH);
  return {
    width: Math.round(origW * scale),
    height: Math.round(origH * scale),
  };
}

function stepDownResize(
  source: HTMLImageElement,
  finalCanvas: HTMLCanvasElement,
  finalCtx: CanvasRenderingContext2D,
  targetW: number,
  targetH: number
) {
  let currentW = source.width;
  let currentH = source.height;
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d')!;

  tempCanvas.width = currentW;
  tempCanvas.height = currentH;
  tempCtx.drawImage(source, 0, 0);

  while (currentW / 2 > targetW) {
    currentW = Math.round(currentW / 2);
    currentH = Math.round(currentH / 2);
    const stepCanvas = document.createElement('canvas');
    stepCanvas.width = currentW;
    stepCanvas.height = currentH;
    const stepCtx = stepCanvas.getContext('2d')!;
    stepCtx.drawImage(tempCanvas, 0, 0, currentW, currentH);
    tempCanvas.width = currentW;
    tempCanvas.height = currentH;
    tempCtx.drawImage(stepCanvas, 0, 0);
  }

  finalCtx.drawImage(tempCanvas, 0, 0, targetW, targetH);
}