"use client";

import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {description}
        </p>

      </div>

      {action && (
        <div className="flex items-center">
          {action}
        </div>
      )}

    </div>
  );
}