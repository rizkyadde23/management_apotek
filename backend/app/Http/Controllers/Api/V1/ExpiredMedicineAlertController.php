<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\ExpiredMedicineAlert;
use App\Services\ExpiredMedicineAlertService;

class ExpiredMedicineAlertController extends BaseController
{
    public function __construct(
        private ExpiredMedicineAlertService $service
    ) {}

    public function index()
    {
        return $this->success(
            $this->service->getAll(),
            'Daftar alert obat kadaluarsa berhasil diambil'
        );
    }

    public function show(ExpiredMedicineAlert $expiredMedicineAlert)
    {
        return $this->success(
            $this->service->getById($expiredMedicineAlert->id),
            'Detail alert berhasil diambil'
        );
    }

    public function byStatus($status)
    {
        return $this->success(
            $this->service->getByStatus($status),
            "Alert dengan status {$status} berhasil diambil"
        );
    }

    public function expiringMedicines($daysRange = 30)
    {
        return $this->success(
            $this->service->getExpiringMedicines($daysRange),
            "Obat yang akan kadaluarsa dalam {$daysRange} hari berhasil diambil"
        );
    }

    public function generateAlerts()
    {
        $this->service->generateAlerts();

        return $this->success(
            null,
            'Alert otomatis berhasil di-generate'
        );
    }

    public function acknowledge(ExpiredMedicineAlert $expiredMedicineAlert)
    {
        return $this->success(
            $this->service->acknowledge($expiredMedicineAlert->id),
            'Alert berhasil di-acknowledge'
        );
    }

    public function resolve(ExpiredMedicineAlert $expiredMedicineAlert)
    {
        return $this->success(
            $this->service->resolve($expiredMedicineAlert->id),
            'Alert berhasil di-resolve'
        );
    }

    public function dismiss(ExpiredMedicineAlert $expiredMedicineAlert)
    {
        return $this->success(
            $this->service->dismiss($expiredMedicineAlert->id),
            'Alert berhasil di-dismiss'
        );
    }

    public function destroy(ExpiredMedicineAlert $expiredMedicineAlert)
    {
        $this->service->delete($expiredMedicineAlert->id);

        return $this->success(
            null,
            'Alert berhasil dihapus',
            200
        );
    }
}
