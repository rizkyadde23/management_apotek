<?php

namespace App\Repositories;

use App\Models\PreOrder;

class PreOrderRepository
{
    public function paginate(
        int $perPage = 10
    )
    {
        return PreOrder::with([
    'medicine',
    'user',
    'purchaseOrder'
])
        ->latest()
        ->paginate($perPage);
    }

    public function create(
        array $data
    )
    {
        return PreOrder::create($data);
    }

    public function update(
        PreOrder $preOrder,
        array $data
    )
    {
        $preOrder->update($data);

        return $preOrder->fresh();
    }

    public function delete(
        PreOrder $preOrder
    )
    {
        return $preOrder->delete();
    }
}