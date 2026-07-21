import Sidebar from "@/Frontend/components/layout/Sidebar";
import Topbar from "@/Frontend/components/layout/Topbar";
import Dashboard from "@/Frontend/components/dashboard/Dashboard";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Navigation */}
        <Topbar />

        {/* Dashboard Content */}
        <Dashboard />
      </div>
    </div>
  );
}