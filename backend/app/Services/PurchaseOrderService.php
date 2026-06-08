<?php

namespace App\Services;

use DB;
use App\Models\Medicine;
use App\Models\PurchaseOrder;
use App\Models\PreOrder;
use App\Models\StockLog;

use App\Repositories\PurchaseOrderRepository;

class PurchaseOrderService
{
    public function __construct(
        private PurchaseOrderRepository $repository,
        private StockLogService $stockLogService
    ) {}

    public function getAll()
    {
        return $this->repository->paginate();
    }

    public function create(array $data)
{
    return DB::transaction(function () use ($data) {

        $purchaseOrder = PurchaseOrder::create([
            'po_number' => $this->generatePoNumber(),
            'supplier_id' => $data['supplier_id'],
            'created_by' => auth()->id(),
            'status' => 'DRAFT',
            'notes' => $data['notes'] ?? null,
            'ordered_at' => now()
        ]);

        foreach ($data['items'] as $item) {

    $subtotal =
        $item['quantity']
        * $item['unit_price'];

    $purchaseOrder
        ->details()
        ->create([
            'medicine_id' => $item['medicine_id'],
            'quantity' => $item['quantity'],
            'unit_price' => $item['unit_price'],
            'subtotal' => $subtotal
        ]);
}

        /*
        |--------------------------------------------------------------------------
        | Hubungkan Pre Order ke PO
        |--------------------------------------------------------------------------
        */

        if (
            isset($data['pre_order_ids']) &&
            count($data['pre_order_ids']) > 0
        ) {

            PreOrder::whereIn(
                'id',
                $data['pre_order_ids']
            )
            ->whereNull(
                'purchase_order_id'
            )
            ->update([
                'purchase_order_id' => $purchaseOrder->id
            ]);
        }

        return $purchaseOrder->load([
            'supplier',
            'creator',
            'details.medicine',
            'preOrders'
        ]);
    });
}

    public function approve(
        PurchaseOrder $purchaseOrder
    )
    {
        $purchaseOrder->update([
            'status' => 'APPROVED'
        ]);

        return $purchaseOrder;
    }

    public function receive(
        PurchaseOrder $purchaseOrder
    )
    {
        DB::transaction(function () use ($purchaseOrder) {

            foreach (
                $purchaseOrder->details
                as $detail
            ) {

                $medicine = $detail->medicine;

                $medicine->increment(
                    'stock',
                    $detail->quantity
                );

                StockLog::create([
                    'medicine_id' => $medicine->id,
                    'user_id' => auth()->id(),
                    'type' => 'IN',
                    'quantity' => $detail->quantity,
                    'stock_before' => $medicine->getOriginal('stock') - $detail->quantity,
                    'stock_after' => $medicine->fresh()->stock,
                ]);
            }

            $purchaseOrder->update([
                'status' => 'RECEIVED',
                'received_at' => now(),
            ]);

            PreOrder::where(
                'purchase_order_id',
                $purchaseOrder->id
            )
            ->whereIn(
                'status',
                ['PENDING', 'READY']
            )
            ->update([
                'status' => 'COMPLETED'
            ]);
        });
    }

    public function cancel(
        PurchaseOrder $purchaseOrder
    )
    {
        DB::transaction(function () use ($purchaseOrder) {

            $purchaseOrder->update([
                'status' => 'CANCELLED'
            ]);

            PreOrder::where(
                'purchase_order_id',
                $purchaseOrder->id
            )
            ->update([
                'status' => 'CANCELLED'
            ]);
        });

        return $purchaseOrder;
    }

    private function generatePoNumber()
    {
        $last = PurchaseOrder::latest('id')
            ->first();

        $next = $last
            ? $last->id + 1
            : 1;

        return 'PO-' .
            str_pad(
                $next,
                6,
                '0',
                STR_PAD_LEFT
            );
    }
}