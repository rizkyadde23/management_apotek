<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\PurchaseOrder;

use App\Services\PurchaseOrderService;

use App\Http\Requests\PurchaseOrder\StorePurchaseOrderRequest;

class PurchaseOrderController extends BaseController
{
    public function __construct(
        private PurchaseOrderService $service
    ) {}

    public function index()
    {
        return $this->success(
            $this->service->getAll(),
            'Data PO berhasil diambil'
        );
    }

    public function store(
        StorePurchaseOrderRequest $request
    )
    {
        return $this->success(
            $this->service->create(
                $request->validated()
            ),
            'PO berhasil dibuat',
            201
        );
    }

    public function approve(
        PurchaseOrder $purchaseOrder
    )
    {
        return $this->success(
            $this->service->approve(
                $purchaseOrder
            ),
            'PO berhasil disetujui'
        );
    }

    public function receive(
        PurchaseOrder $purchaseOrder
    )
    {
        return $this->success(
            $this->service->receive(
                $purchaseOrder
            ),
            'Barang berhasil diterima'
        );
    }

    public function cancel(
        PurchaseOrder $purchaseOrder
    )
    {
        return $this->success(
            $this->service->cancel(
                $purchaseOrder
            ),
            'PO berhasil dibatalkan'
        );
    }

    public function show(
    PurchaseOrder $purchaseOrder
    )
    {
        return $this->success(
            $purchaseOrder->load([
                'supplier',
                'creator',
                'details.medicine',
                'preOrders'
            ]),
            'Detail PO berhasil diambil'
        );
    }
}