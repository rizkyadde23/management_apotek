"use client";

import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";

export default function NavbarNotification() {
  const { token } = useAuth();

  const { unreadCount } = useNotifications(token, 10000);

  return (
    <a href="/notifications">
      <button
        className="
      relative
      rounded-xl
      p-3
      transition
      hover:bg-slate-100
      "
      >
        <Bell size={22} className="text-slate-700" />

        {unreadCount > 0 && (
          <span
            className="
          absolute
          -right-1
          -top-1
          flex
          h-5
          w-5
          items-center
          justify-center
          rounded-full
          bg-red-500
          text-[10px]
          font-bold
          text-white
          "
          >
            {unreadCount}
          </span>
        )}
      </button>
    </a>
  );
}
