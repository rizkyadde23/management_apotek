/**
 * ChatInterface Component
 * Main chat interface combining list, messages, and input
 */

"use client";

import { useState } from "react";
import { ChatList } from "./ChatList";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Chat } from "@/lib/api/chat";

interface ChatInterfaceProps {
  chats: Chat[];
  currentChat: Chat | null;
  messages: any[];
  isLoading: boolean;
  error: string | null;
  currentUserId?: number;
  onSelectChat: (userId: number, chat: Chat) => void;
  onSendMessage: (message: string) => Promise<void>;
  onDeleteMessage: (messageId: number) => void;
  onDeleteChat: (chatId: number) => void;
  onClose: () => void;
}

export function ChatInterface({
  chats,
  currentChat,
  messages,
  isLoading,
  error,
  currentUserId,
  onSelectChat,
  onSendMessage,
  onDeleteMessage,
  onDeleteChat,
  onClose,
}: ChatInterfaceProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="flex h-full bg-white">
      {/* Chat List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg text-gray-900">Pesan</h2>
          <p className="text-sm text-gray-500">{chats.length} percakapan</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatList
            chats={chats}
            selectedChatId={currentChat?.id}
            onSelectChat={onSelectChat}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Chat Area */}
      {currentChat ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="font-semibold text-gray-900">
                {currentChat.other_user?.name}
              </h2>
              <p className="text-sm text-gray-500">
                {currentChat.other_user?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50"
                title="Hapus percakapan"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-200"
                title="Tutup"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-4 overflow-hidden">
            <MessageList
              messages={messages}
              currentUserId={currentUserId}
              isLoading={isLoading}
              onDeleteMessage={onDeleteMessage}
            />
          </div>

          {/* Input */}
          <MessageInput
            onSend={onSendMessage}
            isLoading={isLoading}
            placeholder={`Pesan ke ${currentChat.other_user?.name}...`}
          />

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Hapus Percakapan?
                </h3>
                <p className="text-gray-600 mb-6">
                  Percakapan dengan {currentChat.other_user?.name} akan dihapus
                  secara permanen.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
                  >
                    Batal
                  </button>
                  <button
                    onClick={async () => {
                      await onDeleteChat(currentChat.id);
                      setShowDeleteConfirm(false);
                      onClose();
                    }}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-lg font-semibold mb-2">Pilih percakapan</p>
            <p className="text-sm">untuk memulai chat</p>
          </div>
        </div>
      )}
    </div>
  );
}
