'use client';

import Link from 'next/link';

/* Hardcoded comparison data */
const METRICS = [
  {
    label: 'Claim Time',
    snapclaim: { value: '<5', unit: 'sec' },
    traditional: { value: '18', unit: 'min' },
    barPercent: { snapclaim: 5, traditional: 100 },
  },
  {
    label: 'Agent Touchpoints',
    snapclaim: { value: '0', unit: '' },
    traditional: { value: '3', unit: '' },
    barPercent: { snapclaim: 0, traditional: 100 },
  },
  {
    label: 'Customer Effort',
    snapclaim: { value: '1', unit: 'tap' },
    traditional: { value: '12+', unit: 'steps' },
    barPercent: { snapclaim: 8, traditional: 100 },
  },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col px-5 py-8 safe-top safe-bottom">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="w-9 h-9 rounded-xl bg-surface-100 border border-white/[0.06] 
            flex items-center justify-center text-gray-400 hover:text-white 
            hover:bg-surface-200 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <h1 className="text-xl font-semibold text-white">Impact Dashboard</h1>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="glass-card p-4 flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            Time saved
          </span>
          <span className="text-2xl font-bold text-gradient">17:55</span>
          <span className="text-xs text-gray-500">per claim</span>
        </div>
        <div className="glass-card p-4 flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
            Agent load
          </span>
          <span className="text-2xl font-bold text-success-light">−100%</span>
          <span className="text-xs text-gray-500">zero touch</span>
        </div>
      </div>

      {/* Comparison chart */}
      <div className="glass-card p-5 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            SnapClaim vs Traditional
          </h2>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-brand-500 to-brand-400" />
            <span className="text-gray-400">SnapClaim</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-surface-300" />
            <span className="text-gray-400">Traditional</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex flex-col gap-5">
          {METRICS.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-2.5">
              <span className="text-sm text-gray-400 font-medium">
                {metric.label}
              </span>

              {/* Traditional bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-7 rounded-lg bg-surface-200 overflow-hidden">
                  <div
                    className="h-full rounded-lg bg-surface-300 transition-all duration-1000 ease-out 
                      flex items-center px-3"
                    style={{
                      width: `${metric.barPercent.traditional}%`,
                      animationDelay: '0.3s',
                    }}
                  >
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                      {metric.traditional.value}
                      {metric.traditional.unit && ` ${metric.traditional.unit}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* SnapClaim bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-7 rounded-lg bg-surface-200 overflow-hidden">
                  <div
                    className={`h-full rounded-lg bg-gradient-to-r from-brand-600 to-brand-400 
                      transition-all duration-1000 ease-out flex items-center px-3
                      ${metric.barPercent.snapclaim === 0 ? 'min-w-[60px]' : ''}`}
                    style={{
                      width: `${Math.max(metric.barPercent.snapclaim, 15)}%`,
                      animationDelay: '0.5s',
                    }}
                  >
                    <span className="text-xs text-white font-semibold whitespace-nowrap">
                      {metric.snapclaim.value}
                      {metric.snapclaim.unit && ` ${metric.snapclaim.unit}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <p className="text-center text-xs text-gray-600 mt-6">
        Hardcoded demo data • No backend call
      </p>
    </div>
  );
}
