<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Medicine;
use Illuminate\Http\JsonResponse;
use App\Services\StockLogService;
use App\Http\Requests\StockLog\StockInRequest;
use App\Http\Requests\StockLog\StockOutRequest;

class StockLogController extends BaseController
{
    public function __construct(
        private StockLogService $StockLogService
    ) {}

    /**
     * Menampilkan histori pergerakan stok.
     */
    public function index(): JsonResponse
    {
        return $this->success(
            $this->StockLogService->getHistory(),
            'Histori stok berhasil diambil'
        );
    }

    /**
     * Menambah stok obat.
     */
    public function stockIn(
        StockInRequest $request,
        Medicine $medicine
    ): JsonResponse
    {
        try {

            $movement = $this->StockLogService->stockIn(
                $medicine,
                $request->quantity,
                $request->notes
            );

            return $this->success(
                $movement->load([
                    'medicine',
                    'user'
                ]),
                'Stok berhasil ditambahkan'
            );

        } catch (\Exception $e) {

            return $this->error(
                $e->getMessage(),
                400
            );

        }
    }

    /**
     * Mengurangi stok obat.
     */
    public function stockOut(
        StockOutRequest $request,
        Medicine $medicine
    ): JsonResponse
    {
        try {

            $movement = $this->StockLogService->stockOut(
                $medicine,
                $request->quantity,
                $request->notes
            );

            return $this->success(
                $movement->load([
                    'medicine',
                    'user'
                ]),
                'Stok berhasil dikurangi'
            );

        } catch (\Exception $e) {

            return $this->error(
                $e->getMessage(),
                400
            );

        }
    }
}