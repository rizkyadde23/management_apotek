<?php

namespace App\Services;

use App\Models\Report;
use App\Models\Transaction;
use App\Repositories\ReportRepository;
use Illuminate\Support\Facades\Storage;
use App\Exports\MedicineExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportService
{
    public function __construct(
        private ReportRepository $repository
    ) {}

    public function getAll($perPage = 15)
    {
        return $this->repository->paginate($perPage);
    }

    public function getById($id)
    {
        return $this->repository->findById($id);
    }

    public function getByUser($userId, $perPage = 15)
    {
        return $this->repository->getByUser($userId, $perPage);
    }

    public function getByType($type, $perPage = 15)
    {
        return $this->repository->getByType($type, $perPage);
    }

    public function createReport(
    $type,
    $format,
    $filters = []
)
{
    $report = $this->repository->create([

        'user_id' => auth()->id(),

        'type' => $type,

        'format' => $format,

        'filters' => $filters

    ]);

    try {

        $filePath = $this->generateReport(
            $report,
            $format
        );

        $this->repository->update(
            $report->id,
            [

                'file_path' => $filePath,

                'generated_at' => now()

            ]
        );

        return $this->repository->findById(
            $report->id
        );

    } catch (\Exception $e) {

        $this->repository->delete(
            $report->id
        );

        throw $e;
    }
}

    private function generateReport($report, $format)
    {
        $fileName = "reports/{$report->type}_{$report->id}_{time()}";

        switch ($report->type) {
            case 'MEDICINE':
                return $this->generateMedicineReport($fileName, $format, $report->filters);
            case 'SALES':
                return $this->generateSalesReport($fileName, $format, $report->filters);
            case 'STOCK':
                return $this->generateStockReport($fileName, $format, $report->filters);
            case 'AUDIT_LOG':
                return $this->generateAuditLogReport($fileName, $format, $report->filters);
            case 'PURCHASE_ORDER':
                return $this->generatePurchaseOrderReport($fileName, $format, $report->filters);
            default:
                throw new \Exception("Report type not supported");
        }
    }

 private function generateMedicineReport(
    $fileName,
    $format,
    $filters
)
{
    $query = \App\Models\Medicine::with([
        'supplier',
        'category'
    ]);

    if (!empty($filters['supplier_id'])) {

        $query->where(
            'supplier_id',
            $filters['supplier_id']
        );

    }

    if (!empty($filters['category_id'])) {

        $query->where(
            'category_id',
            $filters['category_id']
        );

    }

    $medicines = $query->get();

    if ($format === 'excel') {

        $filePath = "{$fileName}.xlsx";

        Excel::store(
            new \App\Exports\MedicineExport($filters),
            $filePath
        );

        return $filePath;
    }

    $pdf = Pdf::loadView(
        'reports.medicine',
        [
            'medicines' => $medicines
        ]
    );

    $filePath = "{$fileName}.pdf";

    Storage::put(
        $filePath,
        $pdf->output()
    );

    return $filePath;
}

    private function generateSalesReport(
    $fileName,
    $format,
    $filters
) {
    $query = Transaction::with([
        'user',
        'details.medicine'
    ]);

    /*
    |--------------------------------------------------------------------------
    | Filter Tanggal
    |--------------------------------------------------------------------------
    */

    if (!empty($filters['start_date'])) {

        $query->whereDate(
            'created_at',
            '>=',
            $filters['start_date']
        );

    }

    if (!empty($filters['end_date'])) {

        $query->whereDate(
            'created_at',
            '<=',
            $filters['end_date']
        );

    }

    $transactions = $query
        ->latest()
        ->get();

    /*
    |--------------------------------------------------------------------------
    | Summary
    |--------------------------------------------------------------------------
    */

    $summary = [

        'total_transactions' => $transactions->count(),

        'total_sales' => $transactions->sum('total'),

        'total_discount' => $transactions->sum('discount'),

        'total_items' => $transactions
            ->flatMap(function ($trx) {

                return $trx->details;

            })
            ->sum('quantity'),

    ];

    /*
    |--------------------------------------------------------------------------
    | Excel
    |--------------------------------------------------------------------------
    */

    if ($format === 'excel') {

        $filePath = "{$fileName}.xlsx";

        Excel::store(
            new \App\Exports\SalesExport(
                $transactions,
                $summary
            ),
            $filePath
        );

        return $filePath;

    }

    /*
    |--------------------------------------------------------------------------
    | PDF
    |--------------------------------------------------------------------------
    */

    $pdf = Pdf::loadView(
        'reports.sales',
        [

            'transactions' => $transactions,

            'summary' => $summary,

            'filters' => $filters

        ]
    );

    $filePath = "{$fileName}.pdf";

    Storage::put(
        $filePath,
        $pdf->output()
    );

    return $filePath;
}

    private function generateStockReport(
    $fileName,
    $format,
    $filters
)
{
    $query = \App\Models\Medicine::with([
        'category',
        'supplier'
    ]);

    if (!empty($filters['category_id'])) {

        $query->where(
            'category_id',
            $filters['category_id']
        );

    }

    if (!empty($filters['supplier_id'])) {

        $query->where(
            'supplier_id',
            $filters['supplier_id']
        );

    }

    $medicines = $query->get();

    if ($format === 'excel') {

        $filePath = "{$fileName}.xlsx";

        \Maatwebsite\Excel\Facades\Excel::store(
            new \App\Exports\StockExport(
                $medicines
            ),
            $filePath
        );

        return $filePath;
    }

    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView(
        'reports.stock',
        [
            'medicines' => $medicines
        ]
    );

    $filePath = "{$fileName}.pdf";

    Storage::put(
        $filePath,
        $pdf->output()
    );

    return $filePath;
}

    private function generateAuditLogReport(
    $fileName,
    $format,
    $filters
)
{
    $query = \App\Models\AuditLog::with(
        'user'
    );

    if (
        !empty($filters['start_date']) &&
        !empty($filters['end_date'])
    ) {

        $query->whereBetween(
            'created_at',
            [
                $filters['start_date'],
                $filters['end_date']
            ]
        );

    }

    if (!empty($filters['user_id'])) {

        $query->where(
            'user_id',
            $filters['user_id']
        );

    }

    $logs = $query
        ->latest()
        ->get();

    if ($format === 'excel') {

        $filePath = "{$fileName}.xlsx";

        \Maatwebsite\Excel\Facades\Excel::store(

            new \App\Exports\AuditLogExport(
                $logs
            ),

            $filePath

        );

        return $filePath;
    }

    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView(
        'reports.audit-log',
        [
            'logs' => $logs
        ]
    );

    $filePath = "{$fileName}.pdf";

    Storage::put(
        $filePath,
        $pdf->output()
    );

    return $filePath;
}

    private function generatePurchaseOrderReport(
    $fileName,
    $format,
    $filters
)
{
    $query = \App\Models\PurchaseOrder::with([
        'supplier',
        'creator'
    ]);

    if (!empty($filters['supplier_id'])) {

        $query->where(
            'supplier_id',
            $filters['supplier_id']
        );

    }

    if (!empty($filters['status'])) {

        $query->where(
            'status',
            $filters['status']
        );

    }

    if (
        !empty($filters['start_date']) &&
        !empty($filters['end_date'])
    ) {

        $query->whereBetween(
            'created_at',
            [
                $filters['start_date'],
                $filters['end_date']
            ]
        );

    }

    $purchaseOrders = $query
        ->latest()
        ->get();

    if ($format === 'excel') {

        $filePath = "{$fileName}.xlsx";

        \Maatwebsite\Excel\Facades\Excel::store(
            new \App\Exports\PurchaseOrderExport(
                $purchaseOrders
            ),
            $filePath
        );

        return $filePath;
    }

    $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView(
        'reports.purchase-order',
        [
            'purchaseOrders' => $purchaseOrders
        ]
    );

    $filePath = "{$fileName}.pdf";

    Storage::put(
        $filePath,
        $pdf->output()
    );

    return $filePath;
}

    public function delete($id)
    {
        $report = $this->repository->findById($id);
        
        if ($report && $report->file_path) {
            Storage::delete($report->file_path);
        }

        return $this->repository->delete($id);
    }
}
