"use client";

import { useEffect, useState } from "react";
// PENTING: Tambahkan import useRouter untuk mengalihkan halaman
import { useRouter } from "next/navigation";

import StatCard from "@/components/ui/StatCard";
// Pastikan path ini benar sesuai struktur proyekmu
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
  const router = useRouter(); // Inisialisasi router Next.js
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil token dari localStorage saat halaman dimuat di browser
    const token = localStorage.getItem("auth_token");

    if (!token) {
      // Jika token TIDAK ADA, langsung tendang ke halaman login
      router.push("/login");
    } else {
      // Jika token ADA, baru panggil API dashboard
      getDashboard()
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch((err) => {
          // Jika API membalas 401 (Token Expired / dihapus dari database Laravel)
          if (err.response?.status === 401) {
            localStorage.removeItem("auth_token"); // Bersihkan token rusak
            router.push("/login"); // Tendang kembali ke login
          } else {
            console.error("Gagal memuat data dashboard:", err);
            setLoading(false);
          }
        });
    }
  }, [router]);

  // Tampilan state loading saat validasi token dan fetch data sedang berjalan
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-700 font-medium">
        Memeriksa Autentikasi & Memuat Dashboard...
      </div>
    );
  }

  // Jika proses selesai tapi data tetap kosong
  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-medium">
        Dashboard gagal dimuat. Sesi Anda mungkin telah berakhir.
      </div>
    );
  }

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
