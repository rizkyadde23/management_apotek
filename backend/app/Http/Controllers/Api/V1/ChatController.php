<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Chat;
use App\Models\ChatMessage;
use App\Services\ChatService;
use Illuminate\Http\Request;

class ChatController extends BaseController
{
    public function __construct(
        private ChatService $chatService
    ) {}

    /**
     * Get all chats for current user
     */
    public function index(Request $request)
    {
        $chats = $this->chatService->getChats(
            $request->user(),
            $request->get('per_page', 20)
        );

        // Add other_user to each chat
        $chats->getCollection()->transform(function ($chat) use ($request) {
            $chat->other_user = $chat->getOtherUser($request->user()->id);
            return $chat;
        });

        return $this->success($chats);
    }

    /**
     * Get or create chat with specific user
     */
    public function getOrCreate(Request $request, int $userId)
    {
        try {
            $chat = $this->chatService->getOrCreateChat(
                $request->user(),
                $userId
            );

            return $this->success(
                $chat,
                'Chat berhasil dibuat/diambil',
                201
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Get specific chat with messages
     */
    public function show(Request $request, Chat $chat)
    {
        try {
            $data = $this->chatService->getChat(
                $chat,
                $request->user(),
                $request->get('page', 1)
            );

            // Add other_user info
            $data['chat']->other_user = $data['chat']->getOtherUser(
                $request->user()->id
            );

            return $this->success([
                'id' => $data['chat']->id,
                'user_one_id' => $data['chat']->user_one_id,
                'user_two_id' => $data['chat']->user_two_id,
                'other_user' => $data['chat']->other_user,
                'created_at' => $data['chat']->created_at,
                'updated_at' => $data['chat']->updated_at,
                'messages' => $data['messages']
            ]);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Get messages for a chat
     */
    public function messages(Request $request, Chat $chat)
    {
        try {
            $messages = $this->chatService->getChat(
                $chat,
                $request->user(),
                $request->get('page', 1)
            )['messages'];

            return $this->success($messages);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Send message
     */
    public function sendMessage(Request $request, Chat $chat)
    {
        try {
            $request->validate([
                'message' => 'required|string|max:5000'
            ]);

            $message = $this->chatService->sendMessage(
                $chat,
                $request->user(),
                $request->input('message')
            );

            return $this->success(
                $message,
                'Pesan berhasil dikirim',
                201
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Delete message
     */
    public function deleteMessage(
        Request $request,
        Chat $chat,
        ChatMessage $message
    ) {
        try {
            $this->chatService->deleteMessage($message, $request->user());

            return $this->success(
                null,
                'Pesan berhasil dihapus'
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    /**
     * Delete chat
     */
    public function destroy(Request $request, Chat $chat)
    {
        try {
            $this->chatService->deleteChat($chat, $request->user());

            return $this->success(
                null,
                'Chat berhasil dihapus'
            );
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }
}
