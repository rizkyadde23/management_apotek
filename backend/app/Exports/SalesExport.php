<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SalesExport implements
    FromCollection,
    WithHeadings,
    ShouldAutoSize
{
    protected Collection $transactions;

    protected array $summary;

    public function __construct(
        Collection $transactions,
        array $summary
    ) {
        $this->transactions = $transactions;
        $this->summary = $summary;
    }

    public function headings(): array
    {
        return [

            'Invoice',

            'Tanggal',

            'Kasir',

            'Status',

            'Subtotal',

            'Discount',

            'Total'

        ];
    }

    public function collection()
    {
        return $this->transactions->map(function ($transaction) {

            return [

                $transaction->transaction_code,

                $transaction->created_at->format('d-m-Y H:i'),

                $transaction->user?->name,

                $transaction->payment_status,

                $transaction->subtotal,

                $transaction->discount,

                $transaction->total

            ];

        });
    }
}