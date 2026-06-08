<?php

namespace App\Repositories;

use App\Models\ExpiredMedicineAlert;

class ExpiredMedicineAlertRepository
{
    public function paginate($perPage = 15)
    {
        return ExpiredMedicineAlert::with('medicine')
            ->latest()
            ->paginate($perPage);
    }

    public function findById($id)
    {
        return ExpiredMedicineAlert::with('medicine')
            ->find($id);
    }

    public function getByStatus($status, $perPage = 15)
    {
        return ExpiredMedicineAlert::where('status', $status)
            ->with('medicine')
            ->latest()
            ->paginate($perPage);
    }

    public function getExpiringMedicines($daysRange = 30)
    {
        return ExpiredMedicineAlert::whereIn('status', ['PENDING', 'ACKNOWLEDGED'])
            ->where('days_until_expiry', '<=', $daysRange)
            ->with('medicine')
            ->orderBy('days_until_expiry', 'asc')
            ->get();
    }

    public function create(array $data)
    {
        return ExpiredMedicineAlert::create($data);
    }

    public function update($id, array $data)
    {
        $alert = $this->findById($id);
        if ($alert) {
            $alert->update($data);
        }
        return $alert;
    }

    public function delete($id)
    {
        return ExpiredMedicineAlert::destroy($id);
    }
}
