// app/components/ChainSelector.tsx
import Image from "next/image";
import React from "react";

type ChainSelectorProps = {
  chainName: string;
  chainLogo?: string; // Optional: use if it's a specific chain
  icon?: React.ReactNode; // Optional: use for custom icons like 'Automatic'
};

export default function ChainSelector({
  chainName,
  chainLogo,
  icon,
}: ChainSelectorProps) {
  return (
    <button className="flex shrink-0 items-center gap-2 rounded-full bg-gray-700/50 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700">
      {chainLogo && (
        <Image
          src={chainLogo}
          alt={`${chainName} logo`}
          width={20}
          height={20}
          className="rounded-full"
        />
      )}
      {icon}
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
