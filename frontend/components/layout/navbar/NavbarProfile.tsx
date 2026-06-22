"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function NavbarProfile() {
  const { user, role, logout } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((x) => x[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() ?? "?";

  return (
    <div className="flex items-center gap-3">

      {/* User Card */}
      <div
        className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        bg-white
        px-3
        py-2
        shadow-sm
        "
      >
        <div
          className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-blue-600
          font-bold
          text-white
          "
        >
          {initials}
        </div>

        <div className="hidden lg:block">
          <p className="font-semibold text-slate-800">
            {user?.name}
          </p>

          <p className="text-xs text-slate-500">
            {role}
          </p>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-xl
        border
        border-slate-200
        bg-white
        text-slate-500
        shadow-sm
        transition-all
        duration-200
        hover:border-red-500
        hover:bg-red-500
        hover:text-white
        "
      >
        <LogOut size={20} />
      </button>

    </div>
  );
}