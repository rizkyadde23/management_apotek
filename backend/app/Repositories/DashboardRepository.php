<?php

namespace App\Repositories;

use App\Models\Medicine;
use App\Models\Supplier;
use App\Models\Transaction;
use App\Models\Notification;
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

    public function salesChart()
{
    return Transaction::select(
            DB::raw("MONTH(created_at) as month"),
            DB::raw("SUM(total) as total")
        )
        ->whereYear(
            'created_at',
            now()->year
        )
        ->where(
            'payment_status',
            'PAID'
        )
        ->groupBy(DB::raw("MONTH(created_at)"))
        ->orderBy(DB::raw("MONTH(created_at)"))
        ->get()
        ->map(function ($item) {

            return [

                'month' => date(
                    'M',
                    mktime(
                        0,
                        0,
                        0,
                        $item->month,
                        1
                    )
                ),

                'total' => (float) $item->total

            ];

        });
}

public function topSellingMedicines()
{
    return DB::table('transaction_details')

        ->join(
            'medicines',
            'transaction_details.medicine_id',
            '=',
            'medicines.id'
        )

        ->select(

            'medicines.name',

            DB::raw(
                'SUM(transaction_details.quantity) as total'
            )

        )

        ->groupBy(
            'medicines.id',
            'medicines.name'
        )

        ->orderByDesc('total')

        ->limit(10)

        ->get();
}

public function stockChart()
{
    return Medicine::query()

        ->join(
            'suppliers',
            'medicines.supplier_id',
            '=',
            'suppliers.id'
        )

        ->select(
            'suppliers.name as supplier',

            DB::raw('SUM(medicines.stock) as stock')
        )

        ->groupBy(
            'suppliers.id',
            'suppliers.name'
        )

        ->orderByDesc('stock')

        ->get();
}

public function paymentChart()
{
    return Transaction::select(

            'payment_status as status',

            DB::raw('COUNT(*) as total')

        )

        ->groupBy('payment_status')

        ->get();
}

public function recentTransactions()
{
    return Transaction::with('user')

        ->latest()

        ->limit(5)

        ->get([
            'id',
            'transaction_code',
            'user_id',
            'total',
            'payment_status',
            'created_at'
        ]);
}

public function recentNotifications()
{
    return Notification::latest()

        ->limit(5)

        ->get([
            'id',
            'title',
            'message',
            'created_at'
        ]);
}
}