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

          // Step-down resize for quality if the image is large
          if (img.width > MAX_DIMENSION * 2 || img.height > MAX_DIMENSION * 2) {
            stepDownResize(img, canvas, ctx, width, height);
          } else {
            ctx.drawImage(img, 0, 0, width, height);
          }

          // Export as JPEG data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          // Extract only the base64 part after the comma
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

  // First draw: full size onto temp
  tempCanvas.width = currentW;
  tempCanvas.height = currentH;
  tempCtx.drawImage(source, 0, 0);

  // Step down by halves until close to target
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

  // Final draw to exact target size
  finalCtx.drawImage(tempCanvas, 0, 0, targetW, targetH);
}