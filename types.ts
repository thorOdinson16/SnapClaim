export interface ClaimResponse {
  success: boolean;
  message: string;
  /** True if claim was approved but WhatsApp delivery failed */
  whatsappFailed?: boolean;
  /** URL to the return label page (if available, especially when WhatsApp fails) */
  labelUrl?: string;
}

export type AppState =
  | 'idle'
  | 'capturing'
  | 'uploading'
  | 'success'
  | 'whatsapp-fallback'
  | 'error';

export interface AppContext {
  state: AppState;
  imageBase64: string | null;
  response: ClaimResponse | null;
  error: string | null;
}

export type AppAction =
  | { type: 'START_CAPTURE' }
  | { type: 'CAPTURE_COMPLETE'; payload: string }
  | { type: 'CAPTURE_CANCELLED' }
  | { type: 'UPLOAD_SUCCESS'; payload: ClaimResponse }
  | { type: 'UPLOAD_ERROR'; payload: string }
  | { type: 'RETRY' }
  | { type: 'RESET' };