/**
 * NotificationCenter Component
 * Full page notification center with filtering and actions
 */

"use client";

import { useState } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationCenterProps {
  notifications: Notification[];
  total: number;
  currentPage: number;
  lastPage: number;
  isLoading: boolean;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
  onMarkAllAsRead: () => void;
  onDeleteAll: () => void;
  onPageChange: (page: number) => void;
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

function formatDateTime(date: string): string {
  return new Date(date).toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function NotificationCenter({
  notifications,
  total,
  currentPage,
  lastPage,
  isLoading,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  onDeleteAll,
  onPageChange,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.is_read;
    if (filter === "read") return notif.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toolbar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "unread"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Belum dibaca ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "read"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Dibaca
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              Tandai semua dibaca
            </button>
          )}
          {total > 0 && (
            <button
              onClick={onDeleteAll}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
            >
              Hapus semua
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Tidak ada notifikasi</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg ${getTypeColor(notif.type)}`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {notif.title}
                    </h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getTypeBadgeColor(
                        notif.type,
                      )}`}
                    >
                      {notif.type}
                    </span>
                    {!notif.is_read && (
                      <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{notif.message}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(notif.created_at)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {!notif.is_read && (
                    <button
                      onClick={() => onMarkAsRead(notif.id)}
                      className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100 rounded transition-colors"
                      title="Tandai dibaca"
                    >
                      Baca
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(notif.id)}
                    className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Hapus"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Sebelumnya
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: lastPage }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === lastPage ||
                  (page >= currentPage - 1 && page <= currentPage + 1),
              )
              .map((page, i, arr) => (
                <div key={page}>
                  {i > 0 && arr[i - 1] !== page - 1 && (
                    <span className="px-2 py-2 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                </div>
              ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya →
          </button>
        </div>
      )}
    </div>
  );
}
