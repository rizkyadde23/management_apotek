/**
 * Chat API Service
 * Handles all chat-related API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  message: string;
  created_at: string;
  updated_at: string;
  sender?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Chat {
  id: number;
  user_one_id: number;
  user_two_id: number;
  created_at: string;
  updated_at: string;
  last_message?: ChatMessage;
  other_user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}

interface PaginatedData {
  current_page: number;
  data: any[];
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

export class ChatService {
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
   * Get all chats for current user
   */
  async getChats(page: number = 1, perPage: number = 10): Promise<PaginatedData> {
    const response = await fetch(
      `${API_BASE_URL}/chats?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }

    const result: ApiResponse = await response.json();
    return result.data;
  }

  /**
   * Get or create chat with specific user
   */
  async getOrCreateChat(userId: number): Promise<Chat> {
    const response = await fetch(`${API_BASE_URL}/chats/with/${userId}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to create chat");
    }

    const result: ApiResponse = await response.json();
    return result.data;
  }

  /**
   * Get specific chat with messages
   */
  async getChat(chatId: number, page: number = 1): Promise<Chat & { messages: PaginatedData }> {
    const response = await fetch(
      `${API_BASE_URL}/chats/${chatId}?page=${page}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chat");
    }

    const result: ApiResponse = await response.json();
    return result.data;
  }

  /**
   * Send message
   */
  async sendMessage(chatId: number, message: string): Promise<ChatMessage> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    const result: ApiResponse = await response.json();
    return result.data;
  }

  /**
   * Get chat messages
   */
  async getMessages(
    chatId: number,
    page: number = 1,
    perPage: number = 20
  ): Promise<PaginatedData> {
    const response = await fetch(
      `${API_BASE_URL}/chats/${chatId}/messages?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const result: ApiResponse = await response.json();
    return result.data;
  }

  /**
   * Delete message
   */
  async deleteMessage(chatId: number, messageId: number): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/chats/${chatId}/messages/${messageId}`,
      {
        method: "DELETE",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete message");
    }
  }

  /**
   * Delete chat
   */
  async deleteChat(chatId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete chat");
    }
  }
}

export const chatService = new ChatService();
