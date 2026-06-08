/**
 * Notification API Service
 * Handles all notification-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

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

interface NotificationResponse {
  success: boolean;
  message: string;
  data: any;
}

interface PaginatedNotifications {
  current_page: number;
  data: Notification[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export class NotificationService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };
  }

  /**
   * Get paginated notifications
   */
  async getNotifications(
    page: number = 1,
    perPage: number = 10
  ): Promise<PaginatedNotifications> {
    const response = await fetch(
      `${API_BASE_URL}/notifications?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    const result: NotificationResponse = await response.json();
    return result.data;
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch unread count");
    }

    const result: NotificationResponse = await response.json();
    return result.data.unread_count;
  }

  /**
   * Get single notification
   */
  async getNotification(id: number): Promise<Notification> {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notification");
    }

    const result: NotificationResponse = await response.json();
    return result.data;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: number): Promise<Notification> {
    const response = await fetch(
      `${API_BASE_URL}/notifications/${id}/read`,
      {
        method: "PATCH",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }

    const result: NotificationResponse = await response.json();
    return result.data;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/notifications/read-all`,
      {
        method: "PATCH",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete notification");
    }
  }

  /**
   * Delete all notifications
   */
  async deleteAllNotifications(): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/notifications/delete-all`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete all notifications");
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
