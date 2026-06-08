<?php

namespace App\Services;

use App\Models\Chat;
use App\Models\ChatMessage;
use App\Models\User;
use App\Repositories\ChatRepository;

class ChatService
{
    public function __construct(
        private ChatRepository $chatRepository
    ) {}

    /**
     * Get all chats for current user
     */
    public function getChats(User $user, int $perPage = 20)
    {
        return $this->chatRepository->getChatsByUser($user, $perPage);
    }

    /**
     * Get or create chat with specific user
     */
    public function getOrCreateChat(
        User $currentUser,
        int $otherUserId
    ): Chat {
        $otherUser = User::find($otherUserId);

        if (!$otherUser) {
            throw new \Exception('User tidak ditemukan');
        }

        if ($otherUser->id === $currentUser->id) {
            throw new \Exception('Tidak bisa chat dengan diri sendiri');
        }

        $chat = $this->chatRepository->findOrCreateBetweenUsers(
            $currentUser,
            $otherUser
        );

        // Add other_user info
        $chat->other_user = $chat->getOtherUser($currentUser->id);

        return $chat;
    }

    /**
     * Get chat with messages
     */
    public function getChat(
        Chat $chat,
        User $user,
        int $page = 1
    ) {
        if (!$this->chatRepository->isUserInChat($chat, $user)) {
            throw new \Exception('User tidak terauthorisasi');
        }

        return [
            'chat' => $chat,
            'messages' => $this->chatRepository->getMessages($chat, $page)
        ];
    }

    /**
     * Send message
     */
    public function sendMessage(
        Chat $chat,
        User $sender,
        string $message
    ): ChatMessage {
        if (!$this->chatRepository->isUserInChat($chat, $sender)) {
            throw new \Exception('User tidak terauthorisasi');
        }

        if (empty(trim($message))) {
            throw new \Exception('Pesan tidak boleh kosong');
        }

        $msg = $this->chatRepository->createMessage(
            $chat,
            $sender,
            $message
        );

        $chat->touch(); // Update chat's updated_at timestamp

        return $msg->load('sender');
    }

    /**
     * Delete message (only by sender)
     */
    public function deleteMessage(
        ChatMessage $message,
        User $user
    ): void {
        if ($message->sender_id !== $user->id) {
            throw new \Exception('Hanya pengirim yang bisa menghapus pesan');
        }

        $this->chatRepository->deleteMessage($message);
    }

    /**
     * Delete chat (delete for current user only)
     */
    public function deleteChat(
        Chat $chat,
        User $user
    ): void {
        if (!$this->chatRepository->isUserInChat($chat, $user)) {
            throw new \Exception('User tidak terauthorisasi');
        }

        $this->chatRepository->deleteChat($chat);
    }

    /**
     * Get chat count for user
     */
    public function getChatCount(User $user): int
    {
        return Chat::where('user_one_id', $user->id)
            ->orWhere('user_two_id', $user->id)
            ->count();
    }
}
