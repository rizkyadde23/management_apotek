<?php

namespace App\Observers;

use App\Models\Medicine;
use App\Services\AuditLogService;

class MedicineObserver
{
    public function __construct(
        private AuditLogService $auditLogService
    ) {}

    /**
     * Handle the Medicine "created" event.
     */
    public function created(Medicine $medicine): void
    {
        $this->auditLogService->log(
            'CREATE',
            'MEDICINE',
            "Menambahkan obat {$medicine->name}",
            null,
            $medicine->toArray()
        );
    }

    /**
     * Handle the Medicine "updated" event.
     */
    public function updated(Medicine $medicine): void
    {
        $this->auditLogService->log(
            'UPDATE',
            'MEDICINE',
            "Mengubah obat {$medicine->name}",
            $medicine->getOriginal(),
            $medicine->getChanges()
        );
    }

    /**
     * Handle the Medicine "deleted" event.
     */
    public function deleted(Medicine $medicine): void
    {
        $this->auditLogService->log(
            'DELETE',
            'MEDICINE',
            "Menghapus obat {$medicine->name}",
            $medicine->toArray(),
            null
        );
    }

    public function restored(Medicine $medicine): void
    {
        //
    }

    public function forceDeleted(Medicine $medicine): void
    {
        //
    }
}