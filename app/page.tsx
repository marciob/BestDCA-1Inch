// app/page.tsx  ← minimal diff
import Header from "./components/Header";
import SwapWidget from "./components/SwapWidget";
import Dashboard from "./components/Dashboard"; // 🆕

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#010409]">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-8 p-4">
        <SwapWidget />
        <Dashboard />
      </main>
    </div>
  );
}
