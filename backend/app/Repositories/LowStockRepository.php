<?php

namespace App\Repositories;

use App\Models\Medicine;
use App\Models\NotificationSetting;

class LowStockRepository
{
    private function threshold()
    {
        return NotificationSetting::first()?->low_stock_threshold ?? 10;
    }

    public function getLowStockMedicines()
    {
        return Medicine::with([
                'category',
                'supplier'
            ])
            ->where('stock', '<=', $this->threshold())
            ->orderBy('stock')
            ->paginate(10);
    }

    public function countLowStock()
    {
        return Medicine::where(
            'stock',
            '<=',
            $this->threshold()
        )->count();
    }

    public function getOutOfStock()
    {
        return Medicine::with([
                'category',
                'supplier'
            ])
            ->where('stock', 0)
            ->paginate(10);
    }
}