import ChainSelector from "./ChainSelector";
import TokenSelector from "./TokenSelector";

export default function Action() {
  return (
    <div className="rounded-xl bg-gray-800 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Action Selector */}
        <button className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white">
          <span>DCA</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {/* From Chain Selector (Now locked to a supported EVM chain) */}
        <ChainSelector chainName="Polygon" chainLogo="/polygon_logo.png" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <input
          type="text"
          className="w-full bg-transparent text-4xl font-bold text-white placeholder-gray-500 focus:outline-none"
          placeholder="1,000"
        />
        <TokenSelector tokenName="USDC" tokenLogo="/usdc_logo.png" />
      </div>
    </div>
  );
}
