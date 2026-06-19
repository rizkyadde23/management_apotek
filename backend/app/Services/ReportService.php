<?php

namespace App\Services;

use App\Models\Report;
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

    private function generateSalesReport($fileName, $format, $filters)
    {
        $data = [
            'type' => 'Sales Report',
            'generated_at' => now(),
            'note' => 'Implementation untuk export dengan maatwebsite/excel atau dompdf'
        ];

        $filePath = "{$fileName}.{$format}";
        Storage::put($filePath, json_encode($data));
        return $filePath;
    }

    private function generateStockReport($fileName, $format, $filters)
    {
        $data = [
            'type' => 'Stock Report',
            'generated_at' => now(),
            'note' => 'Implementation untuk export dengan maatwebsite/excel atau dompdf'
        ];

        $filePath = "{$fileName}.{$format}";
        Storage::put($filePath, json_encode($data));
        return $filePath;
    }

    private function generateAuditLogReport($fileName, $format, $filters)
    {
        $data = [
            'type' => 'Audit Log Report',
            'generated_at' => now(),
            'note' => 'Implementation untuk export dengan maatwebsite/excel atau dompdf'
        ];

        $filePath = "{$fileName}.{$format}";
        Storage::put($filePath, json_encode($data));
        return $filePath;
    }

    private function generatePurchaseOrderReport($fileName, $format, $filters)
    {
        $data = [
            'type' => 'Purchase Order Report',
            'generated_at' => now(),
            'note' => 'Implementation untuk export dengan maatwebsite/excel atau dompdf'
        ];

        $filePath = "{$fileName}.{$format}";
        Storage::put($filePath, json_encode($data));
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
