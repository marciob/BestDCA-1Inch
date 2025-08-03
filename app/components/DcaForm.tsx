import Card from "./Card";

export default function DcaForm() {
  return (
    <Card title="Setup Your DCA">
      <form className="space-y-6">
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-400"
          >
            USDC Deposit Amount
          </label>
          <div className="mt-1">
            <input type="number" name="amount" id="amount" placeholder="1000" />
          </div>
        </div>

        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-400"
          >
            Duration (in Days)
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="duration"
              id="duration"
              placeholder="30"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="slippage"
            className="block text-sm font-medium text-gray-400"
          >
            Max Slippage (%)
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="slippage"
              id="slippage"
              placeholder="0.5"
              step="0.1"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-green-600 py-3 text-lg font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Start Accumulating
        </button>
      </form>
    </Card>
  );
}
