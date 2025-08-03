// app/page.tsx  ← minimal diff
import Header from "./components/Header";
import SwapWidget from "./components/SwapWidget";
import Dashboard from "./components/Dashboard"; // 🆕

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#010409] via-[#0f1419] to-[#010409]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Left Column - DCA Widget */}
          <div className="lg:w-1/3">
            <SwapWidget />
          </div>

          {/* Right Column - Dashboard */}
          <div className="lg:w-2/3">
            <Dashboard />
          </div>
        </div>
      </main>
    </div>
  );
}
