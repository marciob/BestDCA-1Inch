// app/components/Header.tsx
export default function Header() {
  return (
    <header className="w-full border-b border-gray-800 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Best DCA</h1>
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Connect Wallet
        </button>
      </div>
    </header>
  );
}
