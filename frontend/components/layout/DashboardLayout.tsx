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
      <div className="flex h-screen overflow-hidden bg-slate-100">

        {/* Sidebar tetap */}
        <Sidebar />

        {/* Area kanan */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Navbar tetap */}
          <Navbar />
          {/* Hanya konten yang scroll */}
          <main
            className="
              flex-1
              overflow-y-auto
              p-6
            "
          >
            {children}
          </main>\
        </div>
      </div>
    </ProtectedLayout>
  );
}