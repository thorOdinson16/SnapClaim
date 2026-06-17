import { extractTextFromImage } from './ocr';

const MAX_DIMENSION = 512;
const OCR_DIMENSION = 1024; // higher resolution for OCR

export function processImage(file: File): Promise<string> {
  return resizeImage(file, MAX_DIMENSION);
}

export async function processImageWithOCR(file: File): Promise<{ base64: string; ocrText: string }> {
  const base64 = await resizeImage(file, MAX_DIMENSION);
  const ocrBase64 = await resizeImage(file, OCR_DIMENSION);
  let ocrText = '';
  try {
    ocrText = await extractTextFromImage(ocrBase64);
    console.log('[OCR] Raw:', ocrText);
  } catch (err) {
    console.warn('[OCR] Failed:', err);
  }
  return { base64, ocrText };
}

async function resizeImage(file: File, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const { width, height } = calculateDimensions(img.width, img.height, maxDim);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('No canvas context'));

        // Step-down resize for quality
        if (img.width > maxDim * 2 || img.height > maxDim * 2) {
          stepDownResize(img, canvas, ctx, width, height);
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Preprocess for OCR: grayscale + high contrast
        if (maxDim === OCR_DIMENSION) {
          const imageData = ctx.getImageData(0, 0, width, height);
          for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            const contrast = 128 + (gray - 128) * 1.8; // increase contrast
            const val = Math.min(255, Math.max(0, contrast));
            imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = val;
          }
          ctx.putImageData(imageData, 0, 0);
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const base64 = dataUrl.split(',')[1] || dataUrl;
        resolve(base64);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function calculateDimensions(origW: number, origH: number, maxDim: number) {
  if (origW <= maxDim && origH <= maxDim) return { width: origW, height: origH };
  const scale = maxDim / Math.max(origW, origH);
  return { width: Math.round(origW * scale), height: Math.round(origH * scale) };
}

function stepDownResize(
  source: HTMLImageElement,
  finalCanvas: HTMLCanvasElement,
  finalCtx: CanvasRenderingContext2D,
  targetW: number,
  targetH: number
) {
  let w = source.width, h = source.height;
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCanvas.width = w;
  tempCanvas.height = h;
  tempCtx.drawImage(source, 0, 0);
  while (w / 2 > targetW) {
    w = Math.round(w / 2);
    h = Math.round(h / 2);
    const stepCanvas = document.createElement('canvas');
    stepCanvas.width = w;
    stepCanvas.height = h;
    const stepCtx = stepCanvas.getContext('2d')!;
    stepCtx.drawImage(tempCanvas, 0, 0, w, h);
    tempCanvas.width = w;
    tempCanvas.height = h;
    tempCtx.drawImage(stepCanvas, 0, 0);
  }
  finalCtx.drawImage(tempCanvas, 0, 0, targetW, targetH);
}