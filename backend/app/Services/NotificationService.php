<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Repositories\NotificationRepository;
use App\Enums\NotificationType;

class NotificationService
{
    public function __construct(
        private NotificationRepository $notificationRepository
    ) {}

    public function getMyNotifications(User $user, int $perPage = 10)
    {
        return $this->notificationRepository
            ->paginateByUser($user, $perPage);
    }

    public function getUnreadCount(User $user): int
    {
        return $this->notificationRepository
            ->getUnreadByUser($user);
    }

    public function getNotification(
        int $id,
        User $user
    ): ?Notification {
        return $this->notificationRepository
            ->findByUser($id, $user);
    }

    public function markAsRead(
        Notification $notification
    ): Notification {
        return $this->notificationRepository
            ->markAsRead($notification);
    }

    public function markAllAsRead(User $user): void
    {
        $this->notificationRepository
            ->markAllAsRead($user);
    }

    public function deleteNotification(
        Notification $notification
    ): void {
        $this->notificationRepository
            ->delete($notification);
    }

    public function deleteAllNotifications(User $user): void
    {
        $this->notificationRepository
            ->deleteAllByUser($user);
    }

    /**
     * Create & send notification to user
     */
    public function send(
        User $user,
        NotificationType $type,
        string $title,
        string $message,
        ?array $data = null
    ): Notification {
        return $this->notificationRepository->create([
            'user_id' => $user->id,
            'type' => $type->value,
            'title' => $title,
            'message' => $message,
            'data' => $data ?? [],
            'is_read' => false,
        ]);
    }

    /**
     * Send notification to multiple users
     */
    public function sendToMany(
        array $userIds,
        NotificationType $type,
        string $title,
        string $message,
        ?array $data = null
    ): int {
        $count = 0;
        foreach ($userIds as $userId) {
            $user = User::find($userId);
            if ($user) {
                $this->send($user, $type, $title, $message, $data);
                $count++;
            }
        }
        return $count;
    }

    /**
     * Create low stock notification
     */
    public function sendLowStockAlert(
        string $medicineName,
        int $currentStock,
        int $minStock
    ): void {
        $adminUsers = User::whereHas('role', function ($query) {
            $query->whereIn('name', ['ADMIN', 'OWNER', 'APOTEKER']);
        })->get();

        foreach ($adminUsers as $user) {
            $this->send(
                $user,
                NotificationType::LOW_STOCK,
                "Stok Menipis: {$medicineName}",
                "Stok obat '{$medicineName}' tinggal {$currentStock} unit (minimal: {$minStock})",
                [
                    'medicine_name' => $medicineName,
                    'current_stock' => $currentStock,
                    'min_stock' => $minStock,
                ]
            );
        }
    }

    /**
     * Create expired medicine notification
     */
    public function sendExpiredAlert(
        string $medicineName,
        string $expiredDate
    ): void {
        $adminUsers = User::whereHas('role', function ($query) {
            $query->whereIn('name', ['ADMIN', 'OWNER', 'APOTEKER']);
        })->get();

        foreach ($adminUsers as $user) {
            $this->send(
                $user,
                NotificationType::EXPIRED,
                "Obat Kadaluarsa: {$medicineName}",
                "Obat '{$medicineName}' sudah kadaluarsa pada {$expiredDate}",
                [
                    'medicine_name' => $medicineName,
                    'expired_date' => $expiredDate,
                ]
            );
        }
    }

    /**
     * Create pre-order notification
     */
    public function sendPreOrderAlert(
        User $user,
        string $medicineName,
        string $status
    ): void {
        $this->send(
            $user,
            NotificationType::PREORDER,
            "Update Pre-Order: {$medicineName}",
            "Status pre-order untuk '{$medicineName}' telah berubah menjadi '{$status}'",
            [
                'medicine_name' => $medicineName,
                'status' => $status,
            ]
        );
    }
}
