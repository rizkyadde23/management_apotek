/**
 * Notifications Page
 * Full notification center page
 */

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

export default function NotificationsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [setting, setSetting] = useState({
    low_stock_threshold: 10,
    expired_warning_days: 30,
    auto_notification: true,
  });
  const [saving, setSaving] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    currentPage,
    lastPage,
    total,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications(token, 10000); // Auto-refresh setiap 10 detik

  async function loadSetting() {
    try {
      const data = await getNotificationSetting();

      setSetting(data);
    } catch (error) {
      console.error(error);
    }
  }

  // Get token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");

    if (savedToken) {
      setToken(savedToken);
    }

    loadSetting();
  }, []);

  async function handleSaveSetting() {
    try {
      setSaving(true);

      await updateNotificationSetting(setting);

      alert("Notification setting berhasil disimpan.");
    } catch (error) {
      console.error(error);

      alert("Gagal menyimpan setting.");
    } finally {
      setSaving(false);
    }
  }

  const handlePageChange = async (page: number) => {
    await fetchNotifications(page);
  };

  return (
    <div className="flex h-screen bg-slate-50">
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
              <div
                className="
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-4
              "
              >
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl border p-6 shadow-sm">
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
                    className="
                      w-full
                      border
                      rounded-xl
                      px-4
                      py-3
                      text-black
                    "
                  />
                </div>
              </div>

              <button
                onClick={handleSaveSetting}
                disabled={saving}
                className="
                  mt-6
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-5
                  py-2
                  rounded-xl
                "
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>

            {/* Notification Center */}

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
