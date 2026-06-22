"use client";

import SidebarItem from "./SidebarItem";
import { SidebarSection as SidebarSectionType } from "@/config/sidebar-menu";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  section: SidebarSectionType;
}

export default function SidebarSection({
  section,
}: Props) {

  const { role } = useAuth();

  if (!role) return null;

  const items = section.items.filter((item) =>
    item.roles.includes(role)
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">

      <p className="px-4 pt-4 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
        {section.title}
      </p>

      <div className="space-y-1">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </div>

    </div>
  );
}