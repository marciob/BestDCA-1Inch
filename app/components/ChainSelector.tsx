import Image from "next/image";

type ChainSelectorProps = {
  chainName: string;
  chainLogo: string;
};

export default function ChainSelector({
  chainName,
  chainLogo,
}: ChainSelectorProps) {
  return (
    <button className="flex items-center gap-2 rounded-full bg-gray-700/50 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700">
      <Image
        src={chainLogo}
        alt={`${chainName} logo`}
        width={20}
        height={20}
        className="rounded-full"
      />
      <span>{chainName}</span>
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
  );
}
