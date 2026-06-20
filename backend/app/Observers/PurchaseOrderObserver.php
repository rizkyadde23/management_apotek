<?php

namespace App\Observers;

use App\Models\PurchaseOrder;
use App\Services\AuditLogService;

class PurchaseOrderObserver
{
    public function __construct(
        private AuditLogService $auditLogService
    ) {}

    /**
     * Handle the PurchaseOrder "created" event.
     */
    public function created(PurchaseOrder $purchaseOrder): void
    {
        $this->auditLogService->log(
            'CREATE',
            'PURCHASE_ORDER',
            "Membuat Purchase Order {$purchaseOrder->po_number}",
            null,
            $purchaseOrder->toArray()
        );
    }

    /**
     * Handle the PurchaseOrder "updated" event.
     */
    public function updated(PurchaseOrder $purchaseOrder): void
    {
        $this->auditLogService->log(
            'UPDATE',
            'PURCHASE_ORDER',
            "Mengubah Purchase Order {$purchaseOrder->po_number}",
            $purchaseOrder->getOriginal(),
            $purchaseOrder->getChanges()
        );
    }

    /**
     * Handle the PurchaseOrder "deleted" event.
     */
    public function deleted(PurchaseOrder $purchaseOrder): void
    {
        $this->auditLogService->log(
            'DELETE',
            'PURCHASE_ORDER',
            "Menghapus Purchase Order {$purchaseOrder->po_number}",
            $purchaseOrder->toArray(),
            null
        );
    }

    public function restored(PurchaseOrder $purchaseOrder): void
    {
        //
    }

    public function forceDeleted(PurchaseOrder $purchaseOrder): void
    {
        //
    }
}