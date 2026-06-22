"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
}

export default function SidebarItem({
  label,
  href,
  icon: Icon,
}: SidebarItemProps) {
  const pathname = usePathname();

  const active =
    pathname === href ||
    pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`
        group
        flex
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        text-sm
        font-medium
        transition-all
        duration-200
        ${
          active
            ? "bg-blue-600 text-white shadow-lg"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }
      `}
    >
      <Icon
        size={20}
        className={`
          transition-transform
          duration-200
          ${
            active
              ? "scale-110"
              : "group-hover:scale-110"
          }
        `}
      />

      <span>{label}</span>
    </Link>
  );
}