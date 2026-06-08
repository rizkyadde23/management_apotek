<?php

namespace App\Repositories;

use App\Models\Medicine;

class LowStockRepository
{
    public function getLowStockMedicines()
    {
        return Medicine::with([
            'category',
            'supplier'
        ])
        ->whereColumn(
            'stock',
            '<=',
            'minimum_stock'
        )
        ->orderBy('stock')
        ->paginate(10);
    }

    public function countLowStock()
    {
        return Medicine::whereColumn(
            'stock',
            '<=',
            'minimum_stock'
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