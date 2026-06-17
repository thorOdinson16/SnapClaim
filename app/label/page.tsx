export default function LabelPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 font-sans">
      <div className="bg-surface-100 border-2 border-white/10 rounded-none p-8 max-w-[400px] w-full shadow-2xl shadow-black/50">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tighter text-brand-400">Blue Dart</h1>
            <p className="text-xs text-gray-400 font-semibold">Return Waybill</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Docket #</p>
            <p className="font-mono text-sm font-bold text-white">BD 999 2345 6784</p>
          </div>
        </div>

        {/* Barcode */}
        <div className="mb-6 flex justify-center">
          <svg className="h-16 w-full" viewBox="0 0 400 64">
            <rect x="0" y="0" width="4" height="64" fill="white" />
            <rect x="6" y="0" width="2" height="64" fill="white" />
            <rect x="10" y="0" width="6" height="64" fill="white" />
            <rect x="18" y="0" width="2" height="64" fill="white" />
            <rect x="22" y="0" width="4" height="64" fill="white" />
            <rect x="28" y="0" width="2" height="64" fill="white" />
            <rect x="32" y="0" width="6" height="64" fill="white" />
            <rect x="40" y="0" width="2" height="64" fill="white" />
            <rect x="44" y="0" width="4" height="64" fill="white" />
            <rect x="50" y="0" width="2" height="64" fill="white" />
            <rect x="54" y="0" width="8" height="64" fill="white" />
            <rect x="64" y="0" width="2" height="64" fill="white" />
            <rect x="68" y="0" width="4" height="64" fill="white" />
            <rect x="74" y="0" width="2" height="64" fill="white" />
            <rect x="78" y="0" width="6" height="64" fill="white" />
            <rect x="86" y="0" width="2" height="64" fill="white" />
            <rect x="90" y="0" width="4" height="64" fill="white" />
            <rect x="96" y="0" width="2" height="64" fill="white" />
            <rect x="100" y="0" width="6" height="64" fill="white" />
            <rect x="108" y="0" width="2" height="64" fill="white" />
            <rect x="112" y="0" width="4" height="64" fill="white" />
            <rect x="118" y="0" width="2" height="64" fill="white" />
            <rect x="122" y="0" width="8" height="64" fill="white" />
            <rect x="132" y="0" width="2" height="64" fill="white" />
            <rect x="136" y="0" width="4" height="64" fill="white" />
            <rect x="142" y="0" width="2" height="64" fill="white" />
            <rect x="146" y="0" width="6" height="64" fill="white" />
            <rect x="154" y="0" width="2" height="64" fill="white" />
            <rect x="158" y="0" width="4" height="64" fill="white" />
            <rect x="164" y="0" width="2" height="64" fill="white" />
            <rect x="168" y="0" width="6" height="64" fill="white" />
            <rect x="176" y="0" width="2" height="64" fill="white" />
            <rect x="180" y="0" width="4" height="64" fill="white" />
            <rect x="186" y="0" width="2" height="64" fill="white" />
            <rect x="190" y="0" width="8" height="64" fill="white" />
            <rect x="200" y="0" width="2" height="64" fill="white" />
            <rect x="204" y="0" width="4" height="64" fill="white" />
            <rect x="210" y="0" width="2" height="64" fill="white" />
            <rect x="214" y="0" width="6" height="64" fill="white" />
            <rect x="222" y="0" width="2" height="64" fill="white" />
            <rect x="226" y="0" width="4" height="64" fill="white" />
            <rect x="232" y="0" width="2" height="64" fill="white" />
            <rect x="236" y="0" width="6" height="64" fill="white" />
            <rect x="244" y="0" width="2" height="64" fill="white" />
            <rect x="248" y="0" width="4" height="64" fill="white" />
            <rect x="254" y="0" width="2" height="64" fill="white" />
          </svg>
        </div>

        {/* RMA / Return Info */}
        <div className="border-t-2 border-b-2 border-white/10 py-3 mb-4">
          <p className="text-sm font-bold text-white">RETURN AUTHORIZED</p>
          <p className="text-xs text-gray-400 mt-1">Product: Model X Keyboard</p>
          <p className="text-xs text-gray-400">RMA #: SNAP-2026-0001</p>
          <p className="text-xs text-gray-400">GSTIN: 27AABCT1234Q1Z5</p>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-2 gap-6 text-xs">
          <div>
            <p className="font-bold uppercase tracking-wide mb-1 text-gray-300">FROM</p>
            <p className="font-semibold text-white">SnapClaim Returns</p>
            <p className="text-gray-400">Unit 4, 1st Floor, Technopark</p>
            <p className="text-gray-400">Phase 1, Kariyavattom</p>
            <p className="text-gray-400">Thiruvananthapuram, Kerala 695581</p>
            <p className="text-gray-400">India</p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-wide mb-1 text-gray-300">TO</p>
            <p className="font-semibold text-white">Warranty Service Center</p>
            <p className="text-gray-400">Plot 21, Sector 18</p>
            <p className="text-gray-400">Electronics City, Phase 2</p>
            <p className="text-gray-400">Bengaluru, Karnataka 560100</p>
            <p className="text-gray-400">India</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-white/10 text-[10px] text-gray-500">
          <p>Blue Dart Surface • Bill to: Sender • E-way bill not required</p>
          <p>Generated by SnapClaim • {new Date().toLocaleDateString('en-IN')}</p>
        </div>

      </div>
    </div>
  );
}