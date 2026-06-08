/**
 * MessageList Component
 * Displays chat messages
 */

"use client";

import { ChatMessage } from "@/lib/api/chat";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: number;
  isLoading: boolean;
  onDeleteMessage: (messageId: number) => void;
}

function formatTime(date: string): string {
  return new Date(date).toLocaleString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function MessageList({
  messages,
  currentUserId,
  isLoading,
  onDeleteMessage,
}: MessageListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin inline-block w-6 h-6 border-3 border-gray-300 border-t-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Belum ada pesan. Mulai percakapan!
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-3 overflow-y-auto">
      {messages.map((msg) => {
        const isOwn = msg.sender_id === currentUserId;

        return (
          <div
            key={msg.id}
            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md group relative ${
                isOwn ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg ${
                  isOwn
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="break-words">{msg.message}</p>
              </div>

              {/* Delete button on hover */}
              {isOwn && (
                <button
                  onClick={() => onDeleteMessage(msg.id)}
                  className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 text-sm"
                  title="Hapus pesan"
                >
                  ✕
                </button>
              )}

              <span
                className={`text-xs ${
                  isOwn ? "text-gray-500" : "text-gray-600"
                } mt-1 block text-right`}
              >
                {formatTime(msg.created_at)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
