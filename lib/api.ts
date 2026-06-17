import { ClaimResponse } from '@/types';

/**
 * Submit a damage claim with a base64-encoded image.
 * Calls POST /api/claim — works against both the real backend
 * and the local stub route.
 */
export async function submitClaim(imageBase64: string): Promise<ClaimResponse> {
  try {
    const res = await fetch('/api/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
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
