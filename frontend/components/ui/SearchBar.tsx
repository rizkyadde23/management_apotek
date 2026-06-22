"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <Search
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          rounded-xl
          border
          border-slate-200
          bg-white
          py-3
          pl-11
          pr-4
          text-slate-700
          shadow-sm
          outline-none
          transition-all
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        "
      />
    </div>
  );
}
