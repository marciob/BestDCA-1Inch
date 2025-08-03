import Header from "./components/Header";
import DcaForm from "./components/DcaForm";
import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#010409]">
      <Header />

      <main className="w-full max-w-7xl flex-1 p-4 md:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <DcaForm />
          </div>

          {/* Dashboard Section */}
          <div className="lg:col-span-2">
            <Dashboard />
          </div>
        </div>
      </main>
    </div>
  );
}
