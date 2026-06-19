<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class AuditLogExport implements
    FromCollection,
    WithHeadings,
    ShouldAutoSize
{
    protected Collection $logs;

    public function __construct(
        Collection $logs
    ) {
        $this->logs = $logs;
    }

    public function headings(): array
    {
        return [

            'Tanggal',

            'User',

            'Action',

            'Model',

            'Description'

        ];
    }

    public function collection()
    {
        return $this->logs->map(function ($log) {

            return [

                $log->created_at->format('d-m-Y H:i'),

                $log->user?->name,

                $log->action,

                $log->model,

                $log->description

            ];

        });
    }
}