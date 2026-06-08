<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\LowStockService;

class LowStockController extends BaseController
{
    public function __construct(
        private LowStockService $service
    ) {}

    public function index()
    {
        return $this->success(
            $this->service->getLowStockMedicines(),
            'Data low stock berhasil diambil'
        );
    }

    public function outOfStock()
    {
        return $this->success(
            $this->service->getOutOfStockMedicines(),
            'Data obat habis berhasil diambil'
        );
    }

    public function summary()
    {
        return $this->success([
            'low_stock_count' =>
                $this->service->countLowStock()
        ]);
    }
}