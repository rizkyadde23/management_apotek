/**
 * Chat Page
 * Main chat interface
 */

"use client";

import { useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ChatPage() {
  const [token, setToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();

  const {
    chats,
    currentChat,
    messages,
    isLoading,
    error,
    openChat,
    sendMessage,
    deleteMessage,
    deleteChat,
    closeChat,
  } = useChat(token);

  // Get token and user ID from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUserId = localStorage.getItem("user_id");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUserId) {
      setCurrentUserId(parseInt(savedUserId));
    }
  }, []);

  const handleSelectChat = async (userId: number, chat: any) => {
    await openChat(userId);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          chats={chats}
          currentChat={currentChat}
          messages={messages}
          isLoading={isLoading}
          error={error}
          currentUserId={currentUserId}
          onSelectChat={handleSelectChat}
          onSendMessage={sendMessage}
          onDeleteMessage={deleteMessage}
          onDeleteChat={deleteChat}
          onClose={closeChat}
        />
      </div>
    </div>
  );
}
