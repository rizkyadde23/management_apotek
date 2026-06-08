/**
 * useChat Hook
 * Manages chat state and fetching
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { chatService, Chat, ChatMessage } from "@/lib/api/chat";

interface UseChatReturn {
  chats: Chat[];
  currentChat: Chat | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  fetchChats: () => Promise<void>;
  openChat: (userId: number) => Promise<void>;
  loadChat: (chatId: number, page?: number) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  deleteChat: (chatId: number) => Promise<void>;
  closeChat: () => void;
}

export function useChat(token: string | null = null): UseChatReturn {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);

  // Set token
  useEffect(() => {
    if (token) {
      chatService.setToken(token);
    }
  }, [token]);

  // Fetch chats
  const fetchChats = useCallback(async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await chatService.getChats(1, 20);
      setChats(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch chats"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Open or load chat with user
  const openChat = useCallback(
    async (userId: number) => {
      if (!token) return;

      try {
        setIsLoading(true);
        setError(null);

        const chat = await chatService.getOrCreateChat(userId);
        setCurrentChat(chat);
        setCurrentPage(1);

        // Fetch messages
        const result = await chatService.getChat(chat.id);
        setMessages(result.messages?.data || []);
        setLastPage(result.messages?.last_page || 1);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to open chat"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // Load specific chat
  const loadChat = useCallback(
    async (chatId: number, page: number = 1) => {
      if (!token) return;

      try {
        setIsLoading(true);
        setError(null);

        const chat = await chatService.getChat(chatId, page);
        setCurrentChat({
          id: chat.id,
          user_one_id: chat.user_one_id,
          user_two_id: chat.user_two_id,
          created_at: chat.created_at,
          updated_at: chat.updated_at,
        });
        setMessages(chat.messages?.data || []);
        setCurrentPage(chat.messages?.current_page || 1);
        setLastPage(chat.messages?.last_page || 1);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load chat"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  // Send message
  const sendMessage = useCallback(
    async (message: string) => {
      if (!token || !currentChat) return;

      try {
        setError(null);

        const newMessage = await chatService.sendMessage(currentChat.id, message);
        setMessages((prev) => [newMessage, ...prev]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to send message"
        );
      }
    },
    [token, currentChat]
  );

  // Delete message
  const deleteMessage = useCallback(
    async (messageId: number) => {
      if (!token || !currentChat) return;

      try {
        setError(null);

        await chatService.deleteMessage(currentChat.id, messageId);
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete message"
        );
      }
    },
    [token, currentChat]
  );

  // Delete chat
  const deleteChat = useCallback(
    async (chatId: number) => {
      if (!token) return;

      try {
        setError(null);

        await chatService.deleteChat(chatId);
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (currentChat?.id === chatId) {
          setCurrentChat(null);
          setMessages([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete chat"
        );
      }
    },
    [token, currentChat]
  );

  // Close current chat
  const closeChat = useCallback(() => {
    setCurrentChat(null);
    setMessages([]);
  }, []);

  // Initial fetch
  useEffect(() => {
    if (!token) return;
    fetchChats();
  }, [token, fetchChats]);

  // Auto-refresh messages if chat is open
  useEffect(() => {
    if (!token || !currentChat) return;

    const refresh = async () => {
      try {
        const result = await chatService.getChat(currentChat.id, currentPage);
        setMessages(result.messages?.data || []);
      } catch (err) {
        // Silently fail for auto-refresh
      }
    };

    // Set up interval
    autoRefreshRef.current = setInterval(refresh, 5000);

    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
    };
  }, [token, currentChat, currentPage]);

  return {
    chats,
    currentChat,
    messages,
    isLoading,
    error,
    currentPage,
    lastPage,
    fetchChats,
    openChat,
    loadChat,
    sendMessage,
    deleteMessage,
    deleteChat,
    closeChat,
  };
}
