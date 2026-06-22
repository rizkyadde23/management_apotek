"use client";

import { useAuth } from "@/hooks/useAuth";

export default function SidebarUser() {
  const { user, role } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  function roleColor() {
    switch (role) {
      case "ADMIN":
        return "bg-red-500";

      case "OWNER":
        return "bg-purple-500";

      case "APOTEKER":
        return "bg-emerald-500";

      default:
        return "bg-slate-500";
    }
  }

  return (
    <div className="mx-4 mt-5 mb-6 rounded-2xl border border-slate-700 bg-slate-800 p-4">

      <div className="flex items-center gap-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
          {initials}
        </div>

        <div className="flex-1 overflow-hidden">

          <h3 className="truncate font-semibold text-white">
            {user.name}
          </h3>

          <p className="truncate text-xs text-slate-400">
            {user.email}
          </p>

        </div>

      </div>

      <div className="mt-4">

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${roleColor()}`}
        >
          {role}
        </span>

      </div>

    </div>
  );
}