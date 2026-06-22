"use client";

import { ButtonHTMLAttributes } from "react";

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function PrimaryButton({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        bg-blue-600
        px-5
        py-3
        font-medium
        text-white
        shadow-sm
        transition-all
        duration-200
        hover:bg-blue-700
        hover:shadow-md
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      {children}
    </button>
  );
}