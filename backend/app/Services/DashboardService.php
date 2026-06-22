<?php

namespace App\Services;

use App\Repositories\DashboardRepository;
use App\Repositories\LowStockRepository;
use App\Repositories\ExpiredMedicineRepository;

class DashboardService
{
    public function __construct(
        private DashboardRepository $dashboardRepository,
        private LowStockRepository $lowStockRepository,
        private ExpiredMedicineRepository $expiredRepository
    ) {}

    public function summary()
    {
        return [
            /*
            |--------------------------------------------------------------------------
            | Summary Cards (Hanya Berisi Data Angka/Statistik Utama)
            |--------------------------------------------------------------------------
            */
            'cards' => [
                'total_medicines' =>
                    $this->dashboardRepository->totalMedicines(),

                'total_suppliers' =>
                    $this->dashboardRepository->totalSuppliers(),

                'low_stock' =>
                    $this->lowStockRepository->countLowStock(),

                'expired_medicines' =>
                    $this->expiredRepository->countExpired(),

                'today_revenue' =>
                    $this->dashboardRepository->todayRevenue(),

                'month_revenue' =>
                    $this->dashboardRepository->monthRevenue(),

                'today_transactions' =>
                    $this->dashboardRepository->todayTransaction(),
            ],

            /*
            |--------------------------------------------------------------------------
            | Tables Data (Dikeluarkan dari 'cards' agar terbaca oleh Next.js)
            |--------------------------------------------------------------------------
            */
            'low_stock_table' =>
                $this->lowStockRepository->dashboard(),

            'expired_table' =>
                $this->expiredRepository->dashboard(),

            'recent_transactions' =>
                $this->dashboardRepository->recentTransactions(),

            'recent_notifications' =>
                $this->dashboardRepository->recentNotifications(),

            /*
            |--------------------------------------------------------------------------
            | Analytics Charts
            |--------------------------------------------------------------------------
            */
            'sales_chart' =>
                $this->dashboardRepository->salesChart(),

            'top_medicines' =>
                $this->dashboardRepository->topSellingMedicines(),

            'stock_chart' =>
                $this->dashboardRepository->stockChart(),

            'payment_chart' =>
                $this->dashboardRepository->paymentChart(),
        ];
    }
}