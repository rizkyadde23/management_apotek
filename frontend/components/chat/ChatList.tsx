/**
 * ChatList Component
 * Displays list of conversations
 */

"use client";

import { Chat } from "@/lib/api/chat";

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: number;
  onSelectChat: (userId: number, chat: Chat) => void;
  isLoading: boolean;
}

function formatTime(date: string): string {
  const now = new Date();
  const msgTime = new Date(date);
  const diff = Math.floor((now.getTime() - msgTime.getTime()) / 1000);

  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function ChatList({
  chats,
  selectedChatId,
  onSelectChat,
  isLoading,
}: ChatListProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Tidak ada percakapan
      </div>
    );
  }

  return (
    <div className="divide-y max-h-96 overflow-y-auto">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() =>
            onSelectChat(
              chat.user_two_id,
              chat
            )
          }
          className={`w-full p-3 text-left hover:bg-gray-50 transition-colors flex gap-3 items-start ${
            selectedChatId === chat.id ? "bg-blue-50" : ""
          }`}
        >
          {/* Avatar */}
          <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {chat.other_user?.name?.[0]?.toUpperCase() || "?"}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-900 truncate">
                {chat.other_user?.name}
              </h3>
              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                {chat.last_message && formatTime(chat.last_message.created_at)}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate">
              {chat.last_message?.message || "Tidak ada pesan"}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
