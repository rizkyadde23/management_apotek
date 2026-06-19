<?php

namespace App\Exports;

use App\Models\Medicine;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class MedicineExport implements FromCollection, WithHeadings, ShouldAutoSize
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = Medicine::query()
            ->with([
                'supplier',
                'category'
            ]);

        if (!empty($this->filters['supplier_id'])) {
            $query->where(
                'supplier_id',
                $this->filters['supplier_id']
            );
        }

        if (!empty($this->filters['category_id'])) {
            $query->where(
                'category_id',
                $this->filters['category_id']
            );
        }

        return $query->get()->map(function ($medicine) {
            return [
                $medicine->code,
                $medicine->name,
                $medicine->category?->name,
                $medicine->supplier?->name,
                $medicine->stock,
                $medicine->minimum_stock,
                $medicine->price,
                optional($medicine->expired_date)->format('Y-m-d'),
                $medicine->type,
                $medicine->is_active ? 'Active' : 'Inactive',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Code',
            'Name',
            'Category',
            'Supplier',
            'Stock',
            'Minimum Stock',
            'Price',
            'Expired Date',
            'Type',
            'Status'
        ];
    }
}