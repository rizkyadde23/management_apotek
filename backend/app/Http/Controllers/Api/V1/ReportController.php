<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Report;
use App\Services\ReportService;
use App\Http\Requests\Report\GenerateReportRequest;
use Illuminate\Support\Facades\Storage;

class ReportController extends BaseController
{
    public function __construct(
        private ReportService $service
    ) {}

    public function index()
    {
        return $this->success(
            $this->service->getAll(),
            'Daftar laporan berhasil diambil'
        );
    }

    public function show(Report $report)
    {
        return $this->success(
            $this->service->getById($report->id),
            'Detail laporan berhasil diambil'
        );
    }

    public function myReports()
    {
        return $this->success(
            $this->service->getByUser(auth()->id()),
            'Laporan saya berhasil diambil'
        );
    }

    public function generate(GenerateReportRequest $request)
    {
        try {
            $report = $this->service->createReport(
                $request->type,
                $request->format,
                $request->filters ?? []
            );

            return $this->success(
                $report,
                'Laporan berhasil di-generate',
                201
            );
        } catch (\Exception $e) {
            return $this->error(
                'Gagal membuat laporan: ' . $e->getMessage(),
                500
            );
        }
    }

    public function download(Report $report)
{
    if (!Storage::exists($report->file_path)) {
        return response()->json([
            'message' => 'File tidak ditemukan'
        ], 404);
    }

    return response()->download(
    Storage::path($report->file_path),
    basename($report->file_path)
);
}

    public function destroy(Report $report)
    {
        $this->service->delete($report->id);

        return $this->success(
            null,
            'Laporan berhasil dihapus',
            200
        );
    }
}
