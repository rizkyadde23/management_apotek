<?php

namespace App\Repositories;

use App\Models\Medicine;
use App\Models\Supplier;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;

class DashboardRepository
{
    public function totalMedicines()
    {
        return Medicine::count();
    }

    public function totalSuppliers()
    {
        return Supplier::count();
    }

    public function todayRevenue()
    {
        return Transaction::whereDate(
            'created_at',
            today()
        )
        ->where(
            'payment_status',
            'PAID'
        )
        ->sum('total');
    }

    public function monthRevenue()
    {
        return Transaction::whereMonth(
            'created_at',
            now()->month
        )
        ->whereYear(
            'created_at',
            now()->year
        )
        ->where(
            'payment_status',
            'PAID'
        )
        ->sum('total');
    }

    public function todayTransaction()
    {
        return Transaction::whereDate(
            'created_at',
            today()
        )->count();
    }
}