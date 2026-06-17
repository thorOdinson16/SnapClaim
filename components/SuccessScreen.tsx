'use client';

interface SuccessScreenProps {
  whatsappFailed: boolean;
  labelUrl?: string;
  onReset: () => void;
}

export default function SuccessScreen({ whatsappFailed, labelUrl, onReset }: SuccessScreenProps) {
  if (whatsappFailed) {
    return <WhatsAppFallback labelUrl={labelUrl} onReset={onReset} />;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 text-center w-full max-w-xs mx-auto animate-fade-in">
      {/* Animated checkmark */}
      <div className="relative w-24 h-24 animate-scale-in">
        <div className="absolute inset-0 rounded-full bg-success/10" />
        <div className="absolute inset-2 rounded-full bg-success/20" />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#10b981"
            strokeWidth="3"
            opacity="0.3"
          />
          <path
            d="M30 52 L44 66 L70 38"
            stroke="#34d399"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="100"
            className="animate-check-draw"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white">
          Claim approved!
        </h2>
        <p className="text-gray-300 text-base leading-relaxed">
          Check your WhatsApp for the return label.
        </p>
      </div>

      <button
        onClick={onReset}
        className="mt-4 text-gray-400 hover:text-gray-200 text-sm underline 
          underline-offset-4 transition-colors"
      >
        Start a new claim
      </button>
    </div>
  );
}

/* ─── WhatsApp Fallback ─── */
function WhatsAppFallback({ labelUrl, onReset }: { labelUrl?: string; onReset: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 p-6 text-center w-full max-w-xs mx-auto animate-fade-in">
      {/* Warning / attention icon */}
      <div className="relative w-24 h-24 animate-scale-in">
        <div className="absolute inset-0 rounded-full bg-warning/10" />
        <div className="absolute inset-2 rounded-full bg-warning/15" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-warning-light"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white">
          Claim approved!
        </h2>
        <p className="text-warning-light text-base font-medium">
          We couldn&apos;t send the label via WhatsApp.
        </p>
      </div>

      {/* QR Code – real image from /api/qr, with link to label */}
      <div className="bg-white rounded-2xl p-4 shadow-lg shadow-black/20">
        {labelUrl ? (
          <a href={labelUrl} target="_blank" rel="noopener noreferrer">
            <img
              src="/api/qr"
              alt="Return label QR code"
              className="w-40 h-40"
            />
          </a>
        ) : (
          <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            QR unavailable
          </div>
        )}
      </div>

      <p className="text-gray-300 text-sm leading-relaxed">
        Scan this QR code or{' '}
        {labelUrl ? (
          <a href={labelUrl} target="_blank" className="underline text-brand-300">
            view your return label
          </a>
        ) : (
          'check WhatsApp manually'
        )}{' '}
        for your return label.
      </p>

      <button
        onClick={onReset}
        className="mt-2 text-gray-400 hover:text-gray-200 text-sm underline 
          underline-offset-4 transition-colors"
      >
        Start a new claim
      </button>
    </div>
  );
}