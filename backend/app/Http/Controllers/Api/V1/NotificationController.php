<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends BaseController
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * Get current user's notifications
     */
    public function index(Request $request)
    {
        $notifications = $this->notificationService
            ->getMyNotifications(
                $request->user(),
                $request->get('per_page', 10)
            );

        return $this->success($notifications);
    }

    /**
     * Get unread notification count
     */
    public function unreadCount(Request $request)
    {
        $count = $this->notificationService
            ->getUnreadCount($request->user());

        return $this->success(['unread_count' => $count]);
    }

    /**
     * Get single notification
     */
    public function show(Request $request, int $id)
    {
        $notification = $this->notificationService
            ->getNotification($id, $request->user());

        if (!$notification) {
            return $this->error(
                'Notifikasi tidak ditemukan',
                404
            );
        }

        return $this->success($notification);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, int $id)
    {
        $notification = $this->notificationService
            ->getNotification($id, $request->user());

        if (!$notification) {
            return $this->error(
                'Notifikasi tidak ditemukan',
                404
            );
        }

        $updated = $this->notificationService
            ->markAsRead($notification);

        return $this->success(
            $updated,
            'Notifikasi telah ditandai sebagai dibaca'
        );
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        $this->notificationService
            ->markAllAsRead($request->user());

        return $this->success(
            null,
            'Semua notifikasi telah ditandai sebagai dibaca'
        );
    }

    /**
     * Delete notification
     */
    public function destroy(Request $request, int $id)
    {
        $notification = $this->notificationService
            ->getNotification($id, $request->user());

        if (!$notification) {
            return $this->error(
                'Notifikasi tidak ditemukan',
                404
            );
        }

        $this->notificationService
            ->deleteNotification($notification);

        return $this->success(
            null,
            'Notifikasi berhasil dihapus'
        );
    }

    /**
     * Delete all notifications
     */
    public function destroyAll(Request $request)
    {
        $this->notificationService
            ->deleteAllNotifications($request->user());

        return $this->success(
            null,
            'Semua notifikasi berhasil dihapus'
        );
    }
}
