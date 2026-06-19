<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class PurchaseOrderExport implements
    FromCollection,
    WithHeadings,
    ShouldAutoSize
{
    protected Collection $purchaseOrders;

    public function __construct(Collection $purchaseOrders)
    {
        $this->purchaseOrders = $purchaseOrders;
    }

    public function headings(): array
    {
        return [

            'PO Number',

            'Supplier',

            'Created By',

            'Status',

            'Created At'

        ];
    }

    public function collection()
    {
        return $this->purchaseOrders->map(function ($po) {

            return [

                $po->po_number,

                $po->supplier?->name,

                $po->creator?->name,

                $po->status,

                $po->created_at->format('d-m-Y')

            ];

        });
    }
}