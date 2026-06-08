<?php

namespace App\Repositories;

use App\Models\PurchaseOrder;

class PurchaseOrderRepository
{
    public function paginate()
    {
        return PurchaseOrder::with([
    'supplier',
    'creator',
    'details.medicine',
    'preOrders'
])
        ->latest()
        ->paginate(10);
    }

    public function create(array $data)
    {
        return PurchaseOrder::create($data);
    }

    public function find(int $id)
    {
        return PurchaseOrder::with([
            'supplier',
            'creator',
            'details.medicine'
        ])
        ->findOrFail($id);
    }
}