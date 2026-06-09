"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menus = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },

  {
    label: "Medicines",
    href: "/medicines",
  },

  {
    label: "Kategori Obat",
    href: "/categories",
  },

  {
    label: "Users",
    href: "/users",
  },

  {
    label: "Suppliers",
    href: "/suppliers",
  },

  {
    label: "Transactions",
    href: "/transactions",
  },

  {
    label: "Purchase Orders",
    href: "/purchase-orders",
  },

  {
    label: "Pre Orders",
    href: "/pre-orders",
  },

  {
    label: "Low Stock",
    href: "/low-stock",
  },

  {
    label: "Expired Medicines",
    href: "/expired-medicines",
  },

  {
    label: "Reports",
    href: "/reports",
  },

  {
    label: "Audit Logs",
    href: "/audit-logs",
  },

  {
    label: "Notifications",
    href: "/notifications",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">
      <div className="p-6 text-xl font-bold">Pharmacy App</div>

      <nav className="space-y-2 px-3">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className={`block px-4 py-3 rounded-lg ${
              pathname === menu.href ? "bg-blue-600" : "hover:bg-slate-800"
            }`}
          >
            {menu.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
