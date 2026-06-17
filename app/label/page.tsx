export default function LabelPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="border border-gray-300 rounded p-8 max-w-md w-full shadow-md bg-gray-50">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">FedEx</h1>
            <p className="text-sm text-gray-600">Express Return Label</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Tracking #</p>
            <p className="font-mono font-bold">1Z999AA10123456784</p>
          </div>
        </div>

        <div className="border-t border-b border-gray-300 py-4 mb-4">
          <p className="font-semibold">Return Authorized</p>
          <p className="text-sm text-gray-700 mt-1">
            Product: Model X Keyboard
          </p>
          <p className="text-sm text-gray-700">RMA: SNAP-2026-0001</p>
        </div>

        <div className="text-xs text-gray-500 mb-2">FROM</div>
        <p className="text-sm font-medium">Customer Name</p>
        <p className="text-sm">123 Main Street</p>
        <p className="text-sm">San Francisco, CA 94102</p>

        <div className="mt-4">
          <div className="text-xs text-gray-500 mb-2">TO</div>
          <p className="text-sm font-medium">SnapClaim Returns Center</p>
          <p className="text-sm">456 Logistics Pkwy</p>
          <p className="text-sm">Memphis, TN 38118</p>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-300 flex justify-center">
          <div className="bg-white p-2 border border-black inline-block">
            {/* Dummy barcode */}
            <svg className="h-12 w-32" viewBox="0 0 128 48">
              <rect x="0" y="0" width="2" height="48" fill="black" />
              <rect x="4" y="0" width="1" height="48" fill="black" />
              <rect x="7" y="0" width="3" height="48" fill="black" />
              <rect x="12" y="0" width="1" height="48" fill="black" />
              <rect x="15" y="0" width="2" height="48" fill="black" />
              <rect x="19" y="0" width="1" height="48" fill="black" />
              <rect x="22" y="0" width="3" height="48" fill="black" />
              <rect x="27" y="0" width="1" height="48" fill="black" />
              <rect x="30" y="0" width="2" height="48" fill="black" />
              <rect x="34" y="0" width="1" height="48" fill="black" />
              <rect x="37" y="0" width="3" height="48" fill="black" />
              <rect x="42" y="0" width="1" height="48" fill="black" />
              <rect x="45" y="0" width="2" height="48" fill="black" />
              <rect x="49" y="0" width="1" height="48" fill="black" />
              <rect x="52" y="0" width="3" height="48" fill="black" />
              <rect x="57" y="0" width="1" height="48" fill="black" />
              <rect x="60" y="0" width="2" height="48" fill="black" />
              <rect x="64" y="0" width="1" height="48" fill="black" />
              <rect x="67" y="0" width="3" height="48" fill="black" />
              <rect x="72" y="0" width="1" height="48" fill="black" />
              <rect x="75" y="0" width="2" height="48" fill="black" />
              <rect x="79" y="0" width="1" height="48" fill="black" />
              <rect x="82" y="0" width="3" height="48" fill="black" />
              <rect x="87" y="0" width="1" height="48" fill="black" />
              <rect x="90" y="0" width="2" height="48" fill="black" />
              <rect x="94" y="0" width="1" height="48" fill="black" />
              <rect x="97" y="0" width="3" height="48" fill="black" />
              <rect x="102" y="0" width="1" height="48" fill="black" />
              <rect x="105" y="0" width="2" height="48" fill="black" />
              <rect x="109" y="0" width="1" height="48" fill="black" />
              <rect x="112" y="0" width="3" height="48" fill="black" />
              <rect x="117" y="0" width="1" height="48" fill="black" />
              <rect x="120" y="0" width="2" height="48" fill="black" />
              <rect x="124" y="0" width="1" height="48" fill="black" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}