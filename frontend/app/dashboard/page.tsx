"use client";

import { useEffect, useState } from "react";

import StatCard from "@/components/dashboard/StatCard";
import { getDashboard } from "@/lib/api/dashboard";

import { DashboardData } from "@/types/dashboard";

export default function DashboardPage() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const result =
        await getDashboard();

      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-slate-700">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-red-500">
        Dashboard gagal dimuat
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Obat"
          value={data.total_medicines}
        />

        <StatCard
          title="Total Supplier"
          value={data.total_suppliers}
        />

        <StatCard
          title="Low Stock"
          value={data.low_stock}
        />

        <StatCard
          title="Expired"
          value={data.expired_medicines}
        />

        <StatCard
          title="Transaksi Hari Ini"
          value={data.today_transactions}
        />

        <StatCard
          title="Pendapatan Hari Ini"
          value={`Rp ${Number(
            data.today_revenue
          ).toLocaleString("id-ID")}`}
        />

        <StatCard
          title="Pendapatan Bulan Ini"
          value={`Rp ${Number(
            data.month_revenue
          ).toLocaleString("id-ID")}`}
        />
      </div>
    </div>
  );
}