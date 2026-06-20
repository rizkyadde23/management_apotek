<?php

namespace App\Providers;

use App\Models\Medicine;
use App\Observers\MedicineObserver;
use App\Models\Supplier;
use App\Observers\SupplierObserver;
use App\Models\User;
use App\Observers\UserObserver;
use App\Models\PurchaseOrder;
use App\Observers\PurchaseOrderObserver;
use App\Models\Transaction;
use App\Observers\TransactionObserver;
use App\Models\PreOrder;
use App\Observers\PreOrderObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Medicine::observe(MedicineObserver::class);
        Supplier::observe(SupplierObserver::class);
        User::observe(UserObserver::class);
        PurchaseOrder::observe(PurchaseOrderObserver::class);
        Transaction::observe(TransactionObserver::class);
        PreOrder::observe(PreOrderObserver::class);
    }
}
