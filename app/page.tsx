import Header from "./components/Header";
import SwapWidget from "./components/SwapWidget";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#010409]">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4">
        <SwapWidget />
      </main>
    </div>
  );
}
