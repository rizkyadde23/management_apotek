"use client";

import { useEffect, useState } from "react";

import StatCard from "@/components/dashboard/StatCard";
import { getDashboard } from "@/lib/api/dashboard";

import { DashboardData } from "@/types/dashboard";

import SalesChart from "@/components/dashboard/SalesChart";

import TopMedicineChart from "@/components/dashboard/TopMedicineChart";

import StockChart from "@/components/dashboard/StockChart";

import PaymentChart from "@/components/dashboard/PaymentChart";

import LowStockTable from "@/components/dashboard/LowStockTable";

import ExpiredTable from "@/components/dashboard/ExpiredTable";

import RecentTransactionTable from "@/components/dashboard/RecentTransactionTable";

import RecentNotificationTable from "@/components/dashboard/RecentNotificationTable";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const result = await getDashboard();

      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-slate-700">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="text-red-500">Dashboard gagal dimuat</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="mt-8">
          <RecentNotificationTable data={data.recent_notifications} />
        </div>
        <StatCard title="Total Obat" value={data.cards.total_medicines} />

        <StatCard title="Total Supplier" value={data.cards.total_suppliers} />

        <StatCard title="Low Stock" value={data.cards.low_stock} />

        <StatCard title="Expired" value={data.cards.expired_medicines} />

        <StatCard
          title="Transaksi Hari Ini"
          value={data.cards.today_transactions}
        />

        <StatCard
          title="Pendapatan Hari Ini"
          value={`Rp ${Number(data.cards.today_revenue).toLocaleString(
            "id-ID",
          )}`}
        />

        <StatCard
          title="Pendapatan Bulan Ini"
          value={`Rp ${Number(data.cards.month_revenue).toLocaleString(
            "id-ID",
          )}`}
        />
      </div>
      <div className="mt-8">
        <RecentTransactionTable data={data.recent_transactions} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
        <LowStockTable data={data.low_stock_table} />
        <ExpiredTable data={data.expired_table} />
        <SalesChart data={data.sales_chart} />
        <TopMedicineChart data={data.top_medicines} />
        <StockChart data={data.stock_chart} />
        <PaymentChart data={data.payment_chart} />
      </div>
    </div>
  );
}
