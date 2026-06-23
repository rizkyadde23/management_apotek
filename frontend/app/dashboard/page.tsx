"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import StatCard from "@/components/ui/StatCard";
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
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);

  // 1. KUNCI UTAMA: Default state loading HARUS true
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      // Jika tidak ada token, langsung tendang ke login dan JANGAN ubah loading ke false
      router.replace("/login");
    } else {
      getDashboard()
        .then((res) => {
          setData(res);
          setLoading(false); // Hanya matikan loading jika data sukses diambil
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            localStorage.removeItem("auth_token");
            router.replace("/login");
          } else {
            console.error("Gagal memuat data dashboard:", err);
            setLoading(false);
          }
        });
    }
  }, [router]);

  // 2. KUNCI KEDUA: Selama loading masih true, potong kompas di sini.
  // Kode HTML dashboard di bawah sama sekali tidak akan sempat dieksekusi atau diintip browser.
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-700 font-medium">
        <div className="flex flex-col items-center gap-2">
          {/* Kamu bisa ganti ini dengan spinner loading andalanmu */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
          <p>Memeriksa Autentikasi...</p>
        </div>
      </div>
    );
  }

  // Jika token lolos tapi data bermasalah
  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-medium">
        Sesi Anda berakhir, silakan login kembali.
      </div>
    );
  }

  // 3. Hanya dirender jika loading = false (artinya user terbukti punya token valid)
  return (
    <div>
      <div className="mb-8">
        <RecentNotificationTable data={data.recent_notifications} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
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
          value={`Rp ${Number(data.cards.today_revenue).toLocaleString("id-ID")}`}
        />
        <StatCard
          title="Pendapatan Bulan Ini"
          value={`Rp ${Number(data.cards.month_revenue).toLocaleString("id-ID")}`}
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
