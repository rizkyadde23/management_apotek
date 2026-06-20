<?php

namespace App\Observers;

use App\Models\User;
use App\Services\AuditLogService;

class UserObserver
{
    public function __construct(
        private AuditLogService $auditLogService
    ) {}

    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        $newData = collect($user->toArray())
    ->except([
        'password',
        'remember_token'
    ])
    ->toArray();

$this->auditLogService->log(
    'CREATE',
    'USER',
    "Menambahkan user {$user->name}",
    null,
    $newData
);
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        $oldData = collect($user->getOriginal())
    ->except([
        'password',
        'remember_token'
    ])
    ->toArray();

$newData = collect($user->getChanges())
    ->except([
        'password',
        'remember_token'
    ])
    ->toArray();

$this->auditLogService->log(
    'UPDATE',
    'USER',
    "Mengubah user {$user->name}",
    $oldData,
    $newData
);
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        $oldData = collect($user->toArray())
    ->except([
        'password',
        'remember_token'
    ])
    ->toArray();

$this->auditLogService->log(
    'DELETE',
    'USER',
    "Menghapus user {$user->name}",
    $oldData,
    null
);
    }

    public function restored(User $user): void
    {
        //
    }

    public function forceDeleted(User $user): void
    {
        //
    }
}