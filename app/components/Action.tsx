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

        {/* From Chain Selector */}
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

      {/* --- NEW DURATION SECTION --- */}
      <div className="mt-4 border-t border-gray-700 pt-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="duration"
            className="text-sm font-medium text-gray-400"
          >
            Over a period of
          </label>
          <div className="flex w-2/5 items-center gap-2">
            <input
              id="duration"
              name="duration"
              type="number"
              placeholder="30"
              className="w-full rounded-md bg-gray-900 text-right font-medium"
            />
            <span className="text-sm text-gray-400">Days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
