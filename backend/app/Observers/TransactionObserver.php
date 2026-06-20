<?php

namespace App\Observers;

use App\Models\Transaction;
use App\Services\AuditLogService;

class TransactionObserver
{
    public function __construct(
        private AuditLogService $auditLogService
    ) {}

    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        $this->auditLogService->log(
            'CREATE',
            'TRANSACTION',
            "Membuat transaksi {$transaction->transaction_code}",
            null,
            $transaction->toArray()
        );
    }

    /**
     * Handle the Transaction "updated" event.
     */
    public function updated(Transaction $transaction): void
    {
        $this->auditLogService->log(
            'UPDATE',
            'TRANSACTION',
            "Mengubah transaksi {$transaction->transaction_code}",
            $transaction->getOriginal(),
            $transaction->getChanges()
        );
    }

    /**
     * Handle the Transaction "deleted" event.
     */
    public function deleted(Transaction $transaction): void
    {
        $this->auditLogService->log(
            'DELETE',
            'TRANSACTION',
            "Menghapus transaksi {$transaction->transaction_code}",
            $transaction->toArray(),
            null
        );
    }

    public function restored(Transaction $transaction): void
    {
        //
    }

    public function forceDeleted(Transaction $transaction): void
    {
        //
    }
}