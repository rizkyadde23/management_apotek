"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import {
  getNotificationSetting,
  updateNotificationSetting,
} from "@/lib/api/notification-settings";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import PageHeader from "@/components/ui/PageHeader";
import { Loader2 } from "lucide-react"; // Ambil icon loader untuk UX yang rapi

export default function NotificationsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [setting, setSetting] = useState({
    low_stock_threshold: 10,
    expired_warning_days: 30,
    auto_notification: true,
  });
  const [saving, setSaving] = useState(false);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null); // null = loading, false = ditolak, true = diizinkan

  const {
    notifications,
    total,
    currentPage,
    lastPage,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications(token, 10000); // Auto-refresh 10s

  // ✨ PERBAIKAN 1: Panggil setting dengan membawa token & handle error 403
  async function loadSetting() {
    try {
      const data = await getNotificationSetting();
      setSetting(data);
      setHasAccess(true); // Jika sukses, tandanya user punya hak akses
    } catch (err: any) {
      console.error("Gagal memuat pengaturan notifikasi:", err);
      // Jika server merespons 403 atau 401, set akses menjadi false
      if (err.response?.status === 403 || err.response?.status === 401) {
        setHasAccess(false);
      } else {
        setHasAccess(true); // Biarkan tetap tampil jika hanya error jaringan biasa
      }
    }
  }

  // ✨ PERBAIKAN 2: Ambil token dulu, setelah token siap baru panggil loadSetting
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Jalankan loadSetting HANYA setelah token berhasil di-set
  useEffect(() => {
    if (token) {
      loadSetting();
    }
  }, [token]);

  async function handleSaveSetting() {
    try {
      setSaving(true);
      await updateNotificationSetting(setting);
      alert("Pengaturan notifikasi berhasil disimpan.");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan pengaturan.");
    } finally {
      setSaving(false);
    }
  }

  const handlePageChange = async (page: number) => {
    await fetchNotifications(page);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            <PageHeader
              title="Notifications"
              description="Manage notification settings and monitor pharmacy alerts."
            />

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* 🌟 PERBAIKAN 3: Kondisional Rendering Hak Akses */}
            {hasAccess === null ? (
              // Sedang mengecek hak akses ke server
              <div className="bg-white rounded-2xl border p-6 flex items-center justify-center gap-2 text-slate-400">
                <Loader2 className="animate-spin text-blue-600" size={18} />
                <p className="text-xs">Memeriksa hak akses pengaturan...</p>
              </div>
            ) : hasAccess === false ? (
              // Jika User Tidak Punya Akses (Kasir/Staff Biasa), tampilkan alert santun tanpa memblokir seluruh halaman
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-xs text-amber-700">
                🔒 Akun Anda tidak memiliki hak akses untuk mengubah konfigurasi durasi kedaluwarsa sistem apotek.
              </div>
            ) : (
              // Jika User adalah Admin / Pemilik Hak Akses, panel pengaturan akan muncul
              <div className="bg-white rounded-2xl border p-6 shadow-sm animate-fadeIn">
                <h2 className="text-lg font-semibold text-slate-900 mb-5">
                  Notification Settings
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-slate-700">
                      Expired Warning Days
                    </label>
                    <input
                      type="number"
                      value={setting.expired_warning_days}
                      onChange={(e) =>
                        setSetting({
                          ...setting,
                          expired_warning_days: Number(e.target.value),
                        })
                      }
                      className="w-full border rounded-xl px-4 py-3 text-black text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveSetting}
                  disabled={saving}
                  className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            )}

            {/* List Notifikasi di bawah tetap tampil untuk memantau alert */}
            <NotificationCenter
              notifications={notifications}
              total={total}
              currentPage={currentPage}
              lastPage={lastPage}
              isLoading={isLoading}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
              onMarkAllAsRead={markAllAsRead}
              onDeleteAll={deleteAllNotifications}
              onPageChange={handlePageChange}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
