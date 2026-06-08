/**
 * NotificationDropdown Component
 * Dropdown list of recent notifications
 */

"use client";

import Link from "next/link";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  onMarkAllAsRead: () => void;
}

function getTypeColor(type: string): string {
  switch (type) {
    case "LOW_STOCK":
      return "bg-yellow-50 border-l-4 border-yellow-400";
    case "EXPIRED":
      return "bg-red-50 border-l-4 border-red-400";
    case "PREORDER":
      return "bg-blue-50 border-l-4 border-blue-400";
    default:
      return "bg-gray-50 border-l-4 border-gray-400";
  }
}

function getTypeBadgeColor(type: string): string {
  switch (type) {
    case "LOW_STOCK":
      return "bg-yellow-200 text-yellow-800";
    case "EXPIRED":
      return "bg-red-200 text-red-800";
    case "PREORDER":
      return "bg-blue-200 text-blue-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
}

function formatTime(date: string): string {
  const now = new Date();
  const notifTime = new Date(date);
  const diff = Math.floor((now.getTime() - notifTime.getTime()) / 1000);

  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit yang lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam yang lalu`;
  return `${Math.floor(diff / 86400)} hari yang lalu`;
}

export function NotificationDropdown({
  notifications,
  unreadCount,
  isLoading,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
}: NotificationDropdownProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Tidak ada notifikasi
      </div>
    );
  }

  return (
    <div className="divide-y">
      {/* Header */}
      {unreadCount > 0 && (
        <div className="p-3 bg-blue-50 flex justify-between items-center">
          <span className="text-sm font-medium text-blue-900">
            {unreadCount} notifikasi baru
          </span>
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            Tandai semua dibaca
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 hover:bg-gray-50 transition-colors ${getTypeColor(
              notif.type
            )}`}
          >
            <div className="flex justify-between items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {notif.title}
                  </h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${getTypeBadgeColor(
                      notif.type
                    )}`}
                  >
                    {notif.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(notif.created_at)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!notif.is_read && (
                  <button
                    onClick={() => onMarkAsRead(notif.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    title="Tandai dibaca"
                  >
                    ✓
                  </button>
                )}
                <button
                  onClick={() => onDelete(notif.id)}
                  className="text-gray-400 hover:text-red-600 text-sm"
                  title="Hapus"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Link
        href="/notifications"
        className="block p-3 text-center text-sm font-medium text-blue-600 hover:bg-gray-50"
      >
        Lihat semua notifikasi →
      </Link>
    </div>
  );
}
