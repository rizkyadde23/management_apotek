"use client";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import ProtectedLayout from "./ProtectedLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedLayout>
  );
}