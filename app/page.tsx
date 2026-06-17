'use client';

import { useReducer, useCallback, useRef } from 'react';
import type { AppContext, AppAction, ClaimResponse } from '@/types';
import { submitClaim } from '@/lib/api';
import CameraCapture from '@/components/CameraCapture';
import ProgressIndicator from '@/components/ProgressIndicator';
import SuccessScreen from '@/components/SuccessScreen';

const initialState: AppContext = {
  state: 'idle',
  imageBase64: null,
  response: null,
  error: null,
};

function reducer(ctx: AppContext, action: AppAction): AppContext {
  switch (action.type) {
    case 'START_CAPTURE':
      return { ...ctx, state: 'capturing', error: null };
    case 'CAPTURE_COMPLETE':
      return { ...ctx, state: 'uploading', imageBase64: action.payload };
    case 'CAPTURE_CANCELLED':
      return { ...ctx, state: 'idle' };
    case 'UPLOAD_SUCCESS': {
      const res = action.payload;
      const whatsappFailed =
        res.whatsappFailed === true ||
        /whatsapp.*fail/i.test(res.message) ||
        /failed.*whatsapp/i.test(res.message);
      return { ...ctx, state: whatsappFailed ? 'whatsapp-fallback' : 'success', response: res };
    }
    case 'UPLOAD_ERROR':
      return { ...ctx, state: 'error', error: action.payload };
    case 'RETRY':
      if (ctx.imageBase64) return { ...ctx, state: 'uploading', error: null };
      return { ...ctx, state: 'idle', error: null };
    case 'RESET':
      return initialState;
    default:
      return ctx;
  }
}

export default function HomePage() {
  const [ctx, dispatch] = useReducer(reducer, initialState);
  const retryImageRef = useRef<string | null>(null);
  const retryOcrRef = useRef<string>('');

  const handleCapture = useCallback(
    async (base64: string, ocrText: string) => {
      dispatch({ type: 'CAPTURE_COMPLETE', payload: base64 });
      retryImageRef.current = base64;
      retryOcrRef.current = ocrText;
      await doUpload(base64, ocrText, dispatch);
    },
    []
  );

  const handleRetry = useCallback(async () => {
    if (retryImageRef.current) {
      dispatch({ type: 'RETRY' });
      await doUpload(retryImageRef.current, retryOcrRef.current, dispatch);
    } else {
      dispatch({ type: 'RESET' });
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 safe-top safe-bottom">
      {ctx.state === 'idle' && (
        <div className="flex flex-col items-center gap-8 w-full max-w-sm animate-fade-in">
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-600/30 mb-2">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gradient">SnapClaim</h1>
            <p className="text-gray-400 text-base text-center leading-relaxed max-w-[260px]">
              File your claim in seconds.<br />Just snap a photo.
            </p>
          </div>
          <button id="start-claim-btn" onClick={() => dispatch({ type: 'START_CAPTURE' })} className="btn-primary">
            <svg className="w-5 h-5 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            Start Claim
          </button>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span>Secure &amp; instant processing</span>
          </div>
        </div>
      )}
      {ctx.state === 'capturing' && (
        <div className="glass-card p-6 w-full max-w-sm animate-slide-up">
          <CameraCapture onCapture={handleCapture} onCancel={() => dispatch({ type: 'CAPTURE_CANCELLED' })} />
        </div>
      )}
      {ctx.state === 'uploading' && (
        <div className="glass-card p-6 w-full max-w-sm animate-slide-up">
          <ProgressIndicator />
        </div>
      )}
      {(ctx.state === 'success' || ctx.state === 'whatsapp-fallback') && (
        <div className="glass-card p-6 w-full max-w-sm animate-slide-up">
          <SuccessScreen
            whatsappFailed={ctx.state === 'whatsapp-fallback'}
            labelUrl={ctx.response?.labelUrl}
            onReset={() => dispatch({ type: 'RESET' })}
          />
        </div>
      )}
      {ctx.state === 'error' && (
        <div className="w-full max-w-sm animate-slide-up">
          <div className="error-card flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-red-300 font-medium text-base">Something went wrong</p>
              <p className="text-red-400/70 text-sm">{ctx.error || 'An unexpected error occurred.'}</p>
            </div>
            <div className="flex flex-col gap-2 w-full mt-1">
              <button id="retry-btn" onClick={handleRetry} className="btn-primary !from-red-600 !to-red-500 hover:!from-red-500 hover:!to-red-400 !shadow-red-600/25">Try again</button>
              <button onClick={() => dispatch({ type: 'RESET' })} className="text-gray-400 hover:text-gray-200 text-sm underline underline-offset-4 transition-colors py-2">Start over</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

async function doUpload(base64: string, ocrText: string, dispatch: React.Dispatch<AppAction>) {
  try {
    const response = await submitClaim(base64, ocrText);
    if (!response.success) {
      dispatch({ type: 'UPLOAD_ERROR', payload: response.message || 'Claim was not successful.' });
      return;
    }
    dispatch({ type: 'UPLOAD_SUCCESS', payload: response });
  } catch (err) {
    dispatch({ type: 'UPLOAD_ERROR', payload: err instanceof Error ? err.message : 'An unexpected error occurred.' });
  }
}