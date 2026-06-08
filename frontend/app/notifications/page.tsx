/**
 * Notifications Page
 * Full notification center page
 */

"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

export default function NotificationsPage() {
  const [token, setToken] = useState<string | null>(null);
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

  // Get token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

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
