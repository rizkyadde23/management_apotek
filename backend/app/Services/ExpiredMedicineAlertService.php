<?php

namespace App\Services;

use App\Models\Medicine;
use App\Models\ExpiredMedicineAlert;
use App\Repositories\ExpiredMedicineAlertRepository;

class ExpiredMedicineAlertService
{
    public function __construct(
        private ExpiredMedicineAlertRepository $repository
    ) {}

    public function getAll($perPage = 15)
    {
        return $this->repository->paginate($perPage);
    }

    public function getById($id)
    {
        return $this->repository->findById($id);
    }

    public function getByStatus($status, $perPage = 15)
    {
        return $this->repository->getByStatus($status, $perPage);
    }

    public function getExpiringMedicines($daysRange = 30)
    {
        return $this->repository->getExpiringMedicines($daysRange);
    }

    public function generateAlerts()
    {
        $medicines = Medicine::where('is_active', true)
            ->whereNotNull('expired_date')
            ->get();

        foreach ($medicines as $medicine) {
            $daysUntilExpiry = now()->diffInDays($medicine->expired_date);

            $existingAlert = ExpiredMedicineAlert::where('medicine_id', $medicine->id)
                ->whereIn('status', ['PENDING', 'ACKNOWLEDGED'])
                ->first();

            if ($existingAlert) {
                continue;
            }

            if ($daysUntilExpiry <= 0) {
                $alertType = 'CRITICAL';
            } elseif ($daysUntilExpiry <= 7) {
                $alertType = 'CRITICAL';
            } elseif ($daysUntilExpiry <= 14) {
                $alertType = 'WARNING';
            } elseif ($daysUntilExpiry <= 30) {
                $alertType = 'INFO';
            } else {
                continue;
            }

            $this->repository->create([
                'medicine_id' => $medicine->id,
                'alert_type' => $alertType,
                'status' => 'PENDING',
                'expiry_date' => $medicine->expired_date,
                'days_until_expiry' => $daysUntilExpiry,
                'notes' => "{$medicine->name} akan kadaluarsa dalam {$daysUntilExpiry} hari"
            ]);
        }
    }

    public function acknowledge($id)
    {
        return $this->repository->update($id, [
            'status' => 'ACKNOWLEDGED'
        ]);
    }

    public function resolve($id)
    {
        return $this->repository->update($id, [
            'status' => 'RESOLVED'
        ]);
    }

    public function dismiss($id)
    {
        return $this->repository->update($id, [
            'status' => 'DISMISSED'
        ]);
    }

    public function delete($id)
    {
        return $this->repository->delete($id);
    }
}
