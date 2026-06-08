<?php

namespace App\Services;

use App\Models\PreOrder;

use App\Repositories\PreOrderRepository;

class PreOrderService
{
    public function __construct(
        private PreOrderRepository $repository
    ) {}

    public function getAll()
    {
        return $this->repository->paginate();
    }

    public function create(
        array $data
    )
    {
        return $this->repository->create([

            'medicine_id' =>
                $data['medicine_id'],

            'user_id' =>
                auth()->id(),

            'customer_name' =>
                $data['customer_name'],

            'customer_phone' =>
                $data['customer_phone'],

            'quantity' =>
                $data['quantity'],

            'status' =>
                'PENDING',

            'estimated_arrival_date' =>
                $data['estimated_arrival_date']
                ?? null,

            'notes' =>
                $data['notes']
                ?? null
        ]);
    }

    public function update(
        PreOrder $preOrder,
        array $data
    )
    {
        return $this->repository->update(
            $preOrder,
            $data
        );
    }

    public function ready(
        PreOrder $preOrder
    )
    {
        return $this->repository->update(
            $preOrder,
            [
                'status' => 'READY'
            ]
        );
    }

    public function complete(
        PreOrder $preOrder
    )
    {
        return $this->repository->update(
            $preOrder,
            [
                'status' => 'COMPLETED'
            ]
        );
    }

    public function cancel(
        PreOrder $preOrder
    )
    {
        return $this->repository->update(
            $preOrder,
            [
                'status' => 'CANCELLED'
            ]
        );
    }
}