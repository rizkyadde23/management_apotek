<?php

namespace App\Observers;

use App\Models\Supplier;
use App\Services\AuditLogService;

class SupplierObserver
{
    public function __construct(
        private AuditLogService $auditLogService
    ) {}

    /**
     * Handle the Supplier "created" event.
     */
    public function created(Supplier $supplier): void
    {
        $this->auditLogService->log(
            'CREATE',
            'SUPPLIER',
            "Menambahkan supplier {$supplier->name}",
            null,
            $supplier->toArray()
        );
    }

    /**
     * Handle the Supplier "updated" event.
     */
    public function updated(Supplier $supplier): void
    {
        $this->auditLogService->log(
            'UPDATE',
            'SUPPLIER',
            "Mengubah supplier {$supplier->name}",
            $supplier->getOriginal(),
            $supplier->getChanges()
        );
    }

    /**
     * Handle the Supplier "deleted" event.
     */
    public function deleted(Supplier $supplier): void
    {
        $this->auditLogService->log(
            'DELETE',
            'SUPPLIER',
            "Menghapus supplier {$supplier->name}",
            $supplier->toArray(),
            null
        );
    }

    /**
     * Handle the Supplier "restored" event.
     */
    public function restored(Supplier $supplier): void
    {
        //
    }

    /**
     * Handle the Supplier "forceDeleted" event.
     */
    public function forceDeleted(Supplier $supplier): void
    {
        //
    }
}