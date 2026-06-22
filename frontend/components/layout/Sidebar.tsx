"use client";

import { LogOut } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { sidebarSections } from "@/config/sidebar-menu";

import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarSection from "./sidebar/SidebarSection";

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-900">

      {/* Header */}
      <SidebarHeader />

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">

        {sidebarSections.map((section) => (
          <SidebarSection
            key={section.title}
            section={section}
          />
        ))}

      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">

        <button
          onClick={logout}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-4
            py-3
            text-slate-300
            transition-all
            duration-200
            hover:bg-red-500
            hover:text-white
          "
        >
          <LogOut size={20} />

          <span className="font-medium">
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}