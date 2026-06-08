<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\PreOrder;

use App\Services\PreOrderService;

use App\Http\Requests\PreOrder\StorePreOrderRequest;

class PreOrderController extends BaseController
{
    public function __construct(
        private PreOrderService $service
    ) {}

    public function index()
    {
        return $this->success(
            $this->service->getAll(),
            'Data preorder berhasil diambil'
        );
    }

    public function store(
        StorePreOrderRequest $request
    )
    {
        return $this->success(
            $this->service->create(
                $request->validated()
            ),
            'Preorder berhasil dibuat',
            201
        );
    }

    public function ready(
        PreOrder $preOrder
    )
    {
        return $this->success(
            $this->service->markReady(
                $preOrder
            ),
            'Preorder siap diambil'
        );
    }

    public function complete(
        PreOrder $preOrder
    )
    {
        return $this->success(
            $this->service->complete(
                $preOrder
            ),
            'Preorder selesai'
        );
    }

    public function cancel(
        PreOrder $preOrder
    )
    {
        return $this->success(
            $this->service->cancel(
                $preOrder
            ),
            'Preorder dibatalkan'
        );
    }
}