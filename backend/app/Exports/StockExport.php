<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StockExport implements
    FromCollection,
    WithHeadings,
    ShouldAutoSize
{
    protected Collection $medicines;

    public function __construct(
        Collection $medicines
    ) {
        $this->medicines = $medicines;
    }

    public function headings(): array
    {
        return [

            'Kode',

            'Nama Obat',

            'Kategori',

            'Supplier',

            'Stok',

            'Minimum Stock',

            'Harga',

            'Expired Date'

        ];
    }

    public function collection()
    {
        return $this->medicines->map(function ($medicine) {

            return [

                $medicine->code,

                $medicine->name,

                $medicine->category?->name,

                $medicine->supplier?->name,

                $medicine->stock,

                $medicine->minimum_stock,

                $medicine->price,

                optional(
                    $medicine->expired_date
                )->format('d-m-Y')

            ];

        });
    }
}