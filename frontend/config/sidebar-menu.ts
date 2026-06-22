import {
  LayoutDashboard,
  Pill,
  FolderTree,
  Truck,
  Users,
  ShoppingCart,
  ClipboardList,
  Package,
  Boxes,
  Bell,
  FileBarChart2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { RoleName } from "@/contexts/AuthContext";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: RoleName[];
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const sidebarSections: SidebarSection[] = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["ADMIN", "OWNER", "APOTEKER"],
      },
    ],
  },

  {
    title: "MASTER DATA",
    items: [
      {
        label: "Medicines",
        href: "/medicines",
        icon: Pill,
        roles: ["ADMIN", "OWNER", "APOTEKER"],
      },

      {
        label: "Categories",
        href: "/categories",
        icon: FolderTree,
        roles: ["ADMIN", "OWNER", "APOTEKER"],
      },

      {
        label: "Suppliers",
        href: "/suppliers",
        icon: Truck,
        roles: ["ADMIN", "OWNER", "APOTEKER"],
      },

      {
        label: "Users",
        href: "/users",
        icon: Users,
        roles: ["ADMIN"],
      },
    ],
  },

  {
    title: "OPERATIONS",
    items: [
      {
        label: "Transactions",
        href: "/transactions",
        icon: ShoppingCart,
        roles: ["ADMIN", "OWNER", "APOTEKER"],
      },

      {
        label: "Purchase Orders",
        href: "/purchase-orders",
        icon: Package,
        roles: ["ADMIN", "OWNER"],
      },

      {
        label: "Pre Orders",
        href: "/pre-orders",
        icon: ClipboardList,
        roles: ["ADMIN", "OWNER", "APOTEKER"],
      },
    ],
  },

  {
    title: "MONITORING",
    items: [
      {
        label: "Low Stock",
        href: "/low-stocks",
        icon: Boxes,
        roles: ["ADMIN", "OWNER", "APOTEKER"],
      },

      {
        label: "Stock Logs",
        href: "/stock-logs",
        icon: Boxes,
        roles: ["ADMIN", "OWNER", "APOTEKER"],
      },

      {
        label: "Expired Medicines",
        href: "/expired-medicines",
        icon: Bell,
        roles: ["ADMIN", "OWNER", "APOTEKER"],
      },

      {
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
        roles: ["ADMIN", "OWNER", "APOTEKER"],
      },
    ],
  },

  {
    title: "ANALYTICS",
    items: [
      {
        label: "Reports",
        href: "/reports",
        icon: FileBarChart2,
        roles: ["ADMIN", "OWNER", "APOTEKER"],
      },

      {
        label: "Audit Logs",
        href: "/audit-logs",
        icon: ShieldCheck,
        roles: ["ADMIN", "OWNER"],
      },
    ],
  },
];