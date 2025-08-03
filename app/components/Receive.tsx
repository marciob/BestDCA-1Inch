// app/components/Receive.tsx
import Image from "next/image";

export default function Receive() {
  return (
    <div className="rounded-xl bg-gray-900 p-4 border border-transparent">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* --- UPDATED TEXT --- */}
        <div className="text-sm font-medium text-gray-400">
          You receive (on Base)
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="w-full text-4xl font-bold text-gray-500">0.0145</div>
        <div className="flex items-center gap-2 rounded-full p-2 text-lg font-medium text-white">
          <Image src="/btc_logo.png" alt="WBTC logo" width={24} height={24} />
          <span>WBTC</span>
        </div>
      </div>
    </div>
  );
}
