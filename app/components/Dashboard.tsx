import Card from "./Card";

// Placeholder data for recent transactions
const recentFills = [
  { id: 1, amount: "0.00021 WBTC", chain: "Arbitrum", time: "1 min ago" },
  { id: 2, amount: "0.00022 WBTC", chain: "Base", time: "16 mins ago" },
  { id: 3, amount: "0.00021 WBTC", chain: "Arbitrum", time: "31 mins ago" },
];

export default function Dashboard() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card title="USDC in Vault">
          <p className="text-3xl font-bold text-white">$985.50</p>
          <p className="text-sm text-gray-400">out of $1000.00</p>
        </Card>
        <Card title="Average WBTC Cost">
          <p className="text-3xl font-bold text-white">$68,123.45</p>
          <p className="text-sm text-green-400">+1.2% vs. market</p>
        </Card>
      </div>
      <Card title="Recent Accumulations">
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {recentFills.map((fill, fillIdx) => (
              <li key={fill.id}>
                <div className="relative pb-8">
                  {fillIdx !== recentFills.length - 1 ? (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-700"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-center space-x-3">
                    <div>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 ring-8 ring-gray-900">
                        <svg
                          className="h-5 w-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4">
                      <div>
                        <p className="text-md text-white">
                          Acquired{" "}
                          <span className="font-bold">{fill.amount}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Filled via {fill.chain}
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        {fill.time}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
