'use client';

import { useState, useEffect } from 'react';

const STEPS = [
  'Analysing damage…',
  'Checking warranty…',
  'Sending return label…',
];

const STEP_INTERVAL = 1200; // ms between step transitions

export default function ProgressIndicator() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev; // stay on last step
      });
    }, STEP_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 p-6 w-full max-w-xs mx-auto animate-fade-in">
      {/* Animated spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-[3px] border-surface-300" />
        <div className="absolute inset-0 rounded-full border-[3px] border-t-brand-400 border-r-transparent border-b-transparent border-l-transparent animate-spin-slow" />
        <div className="absolute inset-2 rounded-full border-[3px] border-t-transparent border-r-brand-300 border-b-transparent border-l-transparent animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-brand-400 animate-pulse-ring" />
        </div>
      </div>

      {/* Step list */}
      <div className="flex flex-col gap-4 w-full">
        {STEPS.map((label, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          const isPending = idx > currentStep;

          return (
            <div
              key={label}
              className={`flex items-center gap-3 transition-all duration-500 ${
                isPending ? 'opacity-30' : 'opacity-100'
              }`}
            >
              {/* Step indicator */}
              <div
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                  transition-all duration-500 ${
                  isCompleted
                    ? 'bg-success/20 text-success-light'
                    : isActive
                    ? 'bg-brand-500/20 text-brand-300 ring-2 ring-brand-400/30'
                    : 'bg-surface-200 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-400 animate-pulse-ring" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-600" />
                )}
              </div>

              {/* Step label */}
              <span
                className={`text-base transition-colors duration-500 ${
                  isCompleted
                    ? 'text-success-light'
                    : isActive
                    ? 'text-white font-medium'
                    : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Shimmer progress bar */}
      <div className="w-full h-1 rounded-full bg-surface-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600 
            bg-[length:200%_100%] animate-shimmer transition-all duration-700 ease-out"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
