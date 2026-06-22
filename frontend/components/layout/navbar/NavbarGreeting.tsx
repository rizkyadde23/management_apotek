"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const titles: Record<string, string> = {
  dashboard: "Dashboard",
  medicines: "Medicines",
  categories: "Medicine Categories",
  suppliers: "Suppliers",
  users: "Users",
  transactions: "Transactions",
  "purchase-orders": "Purchase Orders",
  "pre-orders": "Pre Orders",
  "low-stocks": "Low Stock",
  "stock-logs": "Stock Logs",
  "expired-medicines": "Expired Medicines",
  reports: "Reports",
  notifications: "Notifications",
  "audit-logs": "Audit Logs",
};

export default function NavbarGreeting() {
  const pathname = usePathname();

  const { user } = useAuth();

  const title = useMemo(() => {
    const segment = pathname.split("/")[1];

    return titles[segment] ?? "Dashboard";
  }, [pathname]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Selamat datang kembali,
        <span className="ml-1 font-semibold text-slate-700">
          {user?.name}
        </span>
        👋
      </p>
    </div>
  );
}