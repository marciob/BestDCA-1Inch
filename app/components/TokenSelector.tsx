import Image from "next/image";

type TokenSelectorProps = {
  tokenName: string;
  tokenLogo: string;
};

export default function TokenSelector({
  tokenName,
  tokenLogo,
}: TokenSelectorProps) {
  return (
    <button className="flex items-center gap-2 rounded-full bg-black/30 p-2 text-lg font-medium text-white hover:bg-black/50">
      <Image src={tokenLogo} alt={`${tokenName} logo`} width={24} height={24} />
      <span>{tokenName}</span>
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
