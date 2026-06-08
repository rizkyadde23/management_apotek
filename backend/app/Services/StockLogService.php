<?php

namespace App\Services;

use App\Models\Medicine;
use App\Repositories\StockLogRepository;

class StockLogService
{
    public function __construct(
        private StockLogRepository $repository
    ) {}

    public function stockIn(
        Medicine $medicine,
        int $qty,
        string $notes = null
    )
    {
        $before = $medicine->stock;

        $medicine->increment(
            'stock',
            $qty
        );

        $after = $medicine->fresh()->stock;

        return $this->repository->create([
            'medicine_id' => $medicine->id,
            'user_id' => auth()->id(),
            'type' => 'IN',
            'quantity' => $qty,
            'stock_before' => $before,
            'stock_after' => $after,
            'notes' => $notes
        ]);
    }

    public function stockOut(
        Medicine $medicine,
        int $qty,
        string $notes = null
    )
    {
        if ($medicine->stock < $qty) {
            throw new \Exception(
                'Stok tidak mencukupi'
            );
        }

        $before = $medicine->stock;

        $medicine->decrement(
            'stock',
            $qty
        );

        $after = $medicine->fresh()->stock;

        return $this->repository->create([
            'medicine_id' => $medicine->id,
            'user_id' => auth()->id(),
            'type' => 'OUT',
            'quantity' => $qty,
            'stock_before' => $before,
            'stock_after' => $after,
            'notes' => $notes
        ]);
    }

    public function getHistory()
    {
        return $this->repository
            ->paginate();
    }
}