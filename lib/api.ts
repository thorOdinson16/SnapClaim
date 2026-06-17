import { ClaimResponse } from '@/types';

/**
 * Submit a damage claim with a base64-encoded image and optional OCR text.
 */
export async function submitClaim(imageBase64: string, ocrText?: string): Promise<ClaimResponse> {
  try {
    const res = await fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, ocrText }),
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null);
      throw new Error(
        errorBody?.message || `Server error (${res.status})`
      );
    }

    const data: ClaimResponse = await res.json();
    return data;
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Network error — please check your connection and try again.');
    }
    throw err;
  }
}