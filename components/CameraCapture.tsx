'use client';

import { useRef, useState, useCallback } from 'react';
import { processImage } from '@/lib/image';

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const [showFallback, setShowFallback] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback(async (file: File | null | undefined) => {
    if (!file) return;

    setProcessing(true);
    try {
      const base64 = await processImage(file);
      onCapture(base64);
    } catch (err) {
      console.error('Image processing failed:', err);
      setShowFallback(true);
      setProcessing(false);
    }
  }, [onCapture]);

  const handleCameraChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setShowFallback(true);
      return;
    }
    handleFile(file);
  }, [handleFile]);

  const handleFallbackChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  }, [handleFile]);

  const triggerCamera = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  if (processing) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 animate-fade-in">
        <div className="w-10 h-10 border-[3px] border-brand-400 border-t-transparent rounded-full animate-spin-slow" />
        <p className="text-gray-300 text-base">Processing image…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 p-6 animate-fade-in">
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        capture="environment"
        accept="image/*"
        onChange={handleCameraChange}
        className="hidden"
        aria-label="Take a photo of the damage"
      />

      {!showFallback ? (
        <>
          {/* Camera icon */}
          <div className="w-20 h-20 rounded-full bg-brand-500/10 flex items-center justify-center mb-1">
            <svg
              className="w-10 h-10 text-brand-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
              />
            </svg>
          </div>

          <p className="text-gray-400 text-base text-center">
            Take a photo of the damaged item
          </p>

          {/* Primary: open camera (user gesture → .click() works) */}
          <button
            onClick={triggerCamera}
            className="btn-primary w-full"
          >
            <svg className="w-5 h-5 mr-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            Take Photo
          </button>

          {/* Secondary: choose from gallery */}
          <label
            className="w-full cursor-pointer bg-surface-200 hover:bg-surface-300 
              text-white font-medium py-3.5 px-6 rounded-2xl text-base
              transition-all duration-200 active:scale-[0.97] text-center
              border border-white/10"
          >
            Choose from gallery
            <input
              ref={fallbackInputRef}
              type="file"
              accept="image/*"
              onChange={handleFallbackChange}
              className="hidden"
            />
          </label>

          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-200 text-sm underline 
              underline-offset-4 transition-colors mt-1"
          >
            Go back
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center w-full max-w-xs animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
          </div>

          <p className="text-gray-200 text-base leading-relaxed">
            Please allow camera access in your browser settings and try again.
          </p>

          <label
            className="w-full cursor-pointer bg-surface-200 hover:bg-surface-300 
              text-white font-medium py-3.5 px-6 rounded-2xl text-base
              transition-all duration-200 active:scale-[0.97] text-center
              border border-white/10"
          >
            Choose from gallery
            <input
              type="file"
              accept="image/*"
              onChange={handleFallbackChange}
              className="hidden"
            />
          </label>

          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-200 text-sm underline 
              underline-offset-4 transition-colors mt-1"
          >
            Go back
          </button>
        </div>
      )}
    </div>
  );
}
