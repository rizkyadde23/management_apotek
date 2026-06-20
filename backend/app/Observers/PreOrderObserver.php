<?php

namespace App\Observers;

use App\Models\PreOrder;
use App\Services\AuditLogService;

class PreOrderObserver
{
    public function __construct(
        private AuditLogService $auditLogService
    ) {}

    /**
     * Handle the PreOrder "created" event.
     */
    public function created(PreOrder $preOrder): void
    {
        $this->auditLogService->log(
            'CREATE',
            'PRE_ORDER',
            "Membuat Pre Order #{$preOrder->id}",
            null,
            $preOrder->toArray()
        );
    }

    /**
     * Handle the PreOrder "updated" event.
     */
    public function updated(PreOrder $preOrder): void
    {
        $this->auditLogService->log(
            'UPDATE',
            'PRE_ORDER',
            "Mengubah Pre Order #{$preOrder->id}",
            $preOrder->getOriginal(),
            $preOrder->getChanges()
        );
    }

    /**
     * Handle the PreOrder "deleted" event.
     */
    public function deleted(PreOrder $preOrder): void
    {
        $this->auditLogService->log(
            'DELETE',
            'PRE_ORDER',
            "Menghapus Pre Order #{$preOrder->id}",
            $preOrder->toArray(),
            null
        );
    }

    public function restored(PreOrder $preOrder): void
    {
        //
    }

    public function forceDeleted(PreOrder $preOrder): void
    {
        //
    }
}