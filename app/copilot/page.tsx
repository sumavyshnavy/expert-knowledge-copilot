import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import ChatWindow from "@/components/copilot/ChatWindow";

export default function CopilotPage() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white">
                Expert Knowledge Copilot
              </h1>

              <p className="mt-2 text-slate-400">
                Ask questions about SOPs, manuals, incident reports, equipment,
                compliance policies, and maintenance procedures.
              </p>
            </div>

            <ChatWindow />
          </div>
        </main>
      </div>
    </div>
  );
}
