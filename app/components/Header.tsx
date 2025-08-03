// app/components/Header.tsx (Updated)
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-800 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Best DCA</h1>
        <ConnectButton />
      </div>
    </header>
  );
}
