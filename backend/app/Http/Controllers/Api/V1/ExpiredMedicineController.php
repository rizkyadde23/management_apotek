<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\ExpiredMedicineService;

class ExpiredMedicineController extends BaseController
{
    public function __construct(
        private ExpiredMedicineService $service
    ) {}

    public function expired()
    {
        return $this->success(
            $this->service->getExpired(),
            'Data obat expired berhasil diambil'
        );
    }

    public function expiringSoon()
    {
        return $this->success(
            $this->service->getExpiringSoon(),
            'Data obat mendekati expired berhasil diambil'
        );
    }

    public function summary()
    {
        return $this->success(
            $this->service->summary()
        );
    }
}