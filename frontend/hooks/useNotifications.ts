/**
 * useNotifications Hook
 * Manages notification state and fetching
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { notificationService } from "@/lib/api/notifications";

interface Notification {
  id: number;
  user_id: number;
  type: "LOW_STOCK" | "EXPIRED" | "PREORDER";
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  total: number;
  fetchNotifications: (page?: number) => Promise<void>;
  refetch: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
}

export function useNotifications(
  token: string | null = null,
  autoRefreshInterval: number = 5000
): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set token if provided
  useEffect(() => {
    if (token) {
      notificationService.setToken(token);
    }
  }, [token]);

  // Fetch notifications
  const fetchNotifications = useCallback(
    async (page: number = 1) => {
      if (!token) return;

      try {
        setIsLoading(true);
        setError(null);

        const result = await notificationService.getNotifications(page, 10);
        setNotifications(result.data);
        setCurrentPage(result.current_page);
        setLastPage(result.last_page);
        setTotal(result.total);

        // Also fetch unread count
        const unread = await notificationService.getUnreadCount();
        setUnreadCount(unread);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch notifications"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // Refetch notifications
  const refetch = useCallback(() => {
    return fetchNotifications(currentPage);
  }, [fetchNotifications, currentPage]);

  // Auto-refresh notifications at interval
  useEffect(() => {
    if (!token) return;

    // Initial fetch
    fetchNotifications(1);

    // Setup auto-refresh
    intervalRef.current = setInterval(() => {
      fetchNotifications(1);
    }, autoRefreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [token, autoRefreshInterval, fetchNotifications]);

  // Mark single notification as read
  const markAsRead = useCallback(
    async (id: number) => {
      if (!token) return;

      try {
        await notificationService.markAsRead(id);
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id
              ? {
                  ...notif,
                  is_read: true,
                  read_at: new Date().toISOString(),
                }
              : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to mark as read"
        );
      }
    },
    [token]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!token) return;

    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          is_read: true,
          read_at: new Date().toISOString(),
        }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to mark all as read"
      );
    }
  }, [token]);

  // Delete single notification
  const deleteNotification = useCallback(
    async (id: number) => {
      if (!token) return;

      try {
        await notificationService.deleteNotification(id);
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
        setTotal((prev) => prev - 1);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete notification"
        );
      }
    },
    [token]
  );

  // Delete all notifications
  const deleteAllNotifications = useCallback(async () => {
    if (!token) return;

    try {
      await notificationService.deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      setTotal(0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete all notifications"
      );
    }
  }, [token]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    currentPage,
    lastPage,
    total,
    fetchNotifications,
    refetch,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
}
