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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {error && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow border p-6 mb-6">
        <h2 className="text-xl font-bold mb-5 text-black">
          Notification Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium text-black">
              Low Stock Threshold
            </label>

            <input
              type="number"
              value={setting.low_stock_threshold}
              onChange={(e) =>
                setSetting({
                  ...setting,
                  low_stock_threshold: Number(e.target.value),
                })
              }
              className="w-full border rounded-lg p-2 text-black"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-black">
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
              className="w-full border rounded-lg p-2 text-black"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <input
            type="checkbox"
            checked={setting.auto_notification}
            onChange={(e) =>
              setSetting({
                ...setting,
                auto_notification: e.target.checked,
              })
            }
          />

          <span className="text-black">Auto Notification</span>
        </div>

        <button
          onClick={handleSaveSetting}
          disabled={saving}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          {saving ? "Saving..." : "Save Setting"}
        </button>
      </div>

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
  );
}
