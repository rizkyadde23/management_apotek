<?php

namespace App\Observers;

use App\Models\Category;
use App\Services\AuditLogService;

class CategoryObserver
{
    public function __construct(
        private AuditLogService $auditLogService
    ) {}

    /**
     * Handle the Category "created" event.
     */
    public function created(Category $category): void
    {
        $this->auditLogService->log(
            'CREATE',
            'CATEGORY',
            "Menambahkan kategori {$category->name}",
            null,
            $category->toArray()
        );
    }

    /**
     * Handle the Category "updated" event.
     */
    public function updated(Category $category): void
    {
        $this->auditLogService->log(
            'UPDATE',
            'CATEGORY',
            "Mengubah kategori {$category->name}",
            $category->getOriginal(),
            $category->getChanges()
        );
    }

    /**
     * Handle the Category "deleted" event.
     */
    public function deleted(Category $category): void
    {
        $this->auditLogService->log(
            'DELETE',
            'CATEGORY',
            "Menghapus kategori {$category->name}",
            $category->toArray(),
            null
        );
    }

    public function restored(Category $category): void
    {
        //
    }

    public function forceDeleted(Category $category): void
    {
        //
    }
}