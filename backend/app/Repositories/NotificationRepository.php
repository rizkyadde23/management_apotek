<?php

namespace App\Repositories;

use App\Models\Notification;
use App\Models\User;

class NotificationRepository
{
    public function paginateByUser(
        User $user,
        int $perPage = 10
    ) {
        return Notification::where('user_id', $user->id)
            ->latest()
            ->paginate($perPage);
    }

    public function getUnreadByUser(User $user): int
    {
        return Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();
    }

    public function findByUser(
        int $id,
        User $user
    ): ?Notification {
        return Notification::where('user_id', $user->id)
            ->find($id);
    }

    public function create(array $data): Notification
    {
        return Notification::create($data);
    }

    public function markAsRead(Notification $notification): Notification
    {
        $notification->update([
            'is_read' => true,
            'read_at' => now()
        ]);

        return $notification->fresh();
    }

    public function markAllAsRead(User $user): void
    {
        Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now()
            ]);
    }

    public function delete(Notification $notification): void
    {
        $notification->delete();
    }

    public function deleteAllByUser(User $user): void
    {
        Notification::where('user_id', $user->id)->delete();
    }
}
