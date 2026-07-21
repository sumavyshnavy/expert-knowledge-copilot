"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Bot,
  FileText,
  Network,
  Cpu,
  ShieldCheck,
  BarChart3,
  Settings,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
 
  {
    name: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    name: "Knowledge Graph",
    href: "/graph",
    icon: Network,
  },
  {
    name: "Equipment",
    href: "/equipment",
    icon: Cpu,
  },
  {
    name: "Compliance",
    href: "/compliance",
    icon: ShieldCheck,
  },
  {
    name: "Insights",
    href: "/insights",
    icon: BarChart3,
  },
  {
    name: "AI Assistant",
    href: "/chat",
    icon: Bot,
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-950 h-screen sticky top-0 flex flex-col">

      <div className="px-8 py-8">

        <h1 className="text-2xl font-bold text-white">
          EKC
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Expert Knowledge Copilot
        </p>

      </div>

      <nav className="flex-1 px-4 space-y-2">

        {menu.map((item) => {

          const Icon = item.icon;

          const active = pathname === item.href;

          return (

            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all

              ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >

              <Icon size={20} />

              {item.name}

            </Link>

          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-5">

        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-900 hover:text-white transition">

          <Settings size={20} />

          Settings

        </button>

      </div>

    </aside>
  );
}