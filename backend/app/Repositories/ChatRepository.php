<?php

namespace App\Repositories;

use App\Models\Chat;
use App\Models\ChatMessage;
use App\Models\User;

class ChatRepository
{
    /**
     * Get all chats for a user with pagination
     */
    public function getChatsByUser(
        User $user,
        int $perPage = 20
    ) {
        return Chat::where(function ($query) use ($user) {
                $query->where('user_one_id', $user->id)
                    ->orWhere('user_two_id', $user->id);
            })
            ->with(['userOne', 'userTwo', 'lastMessage.sender'])
            ->latest('updated_at')
            ->paginate($perPage);
    }

    /**
     * Find or create chat between two users
     */
    public function findOrCreateBetweenUsers(
        User $userOne,
        User $userTwo
    ): Chat {
        $chat = Chat::where(function ($query) use ($userOne, $userTwo) {
                $query->where('user_one_id', $userOne->id)
                    ->where('user_two_id', $userTwo->id);
            })->orWhere(function ($query) use ($userOne, $userTwo) {
                $query->where('user_one_id', $userTwo->id)
                    ->where('user_two_id', $userOne->id);
            })->first();

        if (!$chat) {
            $chat = Chat::create([
                'user_one_id' => $userOne->id,
                'user_two_id' => $userTwo->id,
            ]);
        }

        return $chat->load(['userOne', 'userTwo', 'lastMessage.sender']);
    }

    /**
     * Get chat by ID
     */
    public function find(int $id): ?Chat
    {
        return Chat::with(['userOne', 'userTwo', 'lastMessage.sender'])
            ->find($id);
    }

    /**
     * Get messages for a chat with pagination
     */
    public function getMessages(
        Chat $chat,
        int $page = 1,
        int $perPage = 20
    ) {
        return ChatMessage::where('chat_id', $chat->id)
            ->with('sender')
            ->latest()
            ->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Create a message
     */
    public function createMessage(
        Chat $chat,
        User $sender,
        string $message
    ): ChatMessage {
        return ChatMessage::create([
            'chat_id' => $chat->id,
            'sender_id' => $sender->id,
            'message' => $message,
        ]);
    }

    /**
     * Get message by ID
     */
    public function findMessage(int $id): ?ChatMessage
    {
        return ChatMessage::with('sender')->find($id);
    }

    /**
     * Delete message
     */
    public function deleteMessage(ChatMessage $message): void
    {
        $message->delete();
    }

    /**
     * Delete chat
     */
    public function deleteChat(Chat $chat): void
    {
        $chat->delete();
    }

    /**
     * Check if user is part of chat
     */
    public function isUserInChat(
        Chat $chat,
        User $user
    ): bool {
        return $chat->user_one_id === $user->id
            || $chat->user_two_id === $user->id;
    }
}
