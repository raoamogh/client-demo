import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="flex w-full h-screen overflow-hidden">
      {/* 1. The Sidebar (Fixed Width) */}
      <Sidebar />
      
      {/* 2. The Main Content (Fills remaining space) */}
      <Dashboard />
    </main>
  );
}