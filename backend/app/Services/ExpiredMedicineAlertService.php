<?php

namespace App\Services;

use App\Models\Medicine;
use App\Models\Notification;
use App\Models\ExpiredMedicineAlert;
use App\Repositories\ExpiredMedicineAlertRepository;
use Carbon\Carbon;

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
            $expiryDate = Carbon::parse($medicine->expired_date);
            $today = now()->startOfDay();

            // Menggunakan diffInDays dengan parameter false agar menghasilkan minus jika sudah lewat tanggalnya
            $daysUntilExpiry = $today->diffInDays($expiryDate, false);

            $existingAlert = ExpiredMedicineAlert::where('medicine_id', $medicine->id)
                ->whereIn('status', ['PENDING', 'ACKNOWLEDGED'])
                ->first();

            if ($existingAlert) {
                continue;
            }

            // Penentuan Tipe Alert & Pembuatan Judul Pesan Notifikasi
            if ($daysUntilExpiry < 0) {
                $alertType = 'CRITICAL';
                $title = '🚨 Obat Telah Kadaluarsa!';
                $notes = "Obat {$medicine->name} sudah kadaluarsa sejak " . abs($daysUntilExpiry) . " hari yang lalu!";
            } elseif ($daysUntilExpiry <= 7) {
                $alertType = 'CRITICAL';
                $title = '🔥 Bahaya: Obat Kadaluarsa < 7 Hari';
                $notes = "Obat {$medicine->name} akan kadaluarsa kritis dalam {$daysUntilExpiry} hari.";
            } elseif ($daysUntilExpiry <= 14) {
                $alertType = 'WARNING';
                $title = '⚠️ Peringatan: Obat Kadaluarsa < 14 Hari';
                $notes = "Obat {$medicine->name} akan kadaluarsa dalam {$daysUntilExpiry} hari.";
            } elseif ($daysUntilExpiry <= 30) {
                $alertType = 'INFO';
                $title = 'ℹ️ Info: Obat Kadaluarsa < 30 Hari';
                $notes = "Obat {$medicine->name} memasuki masa tenggang kadaluarsa {$daysUntilExpiry} hari.";
            } else {
                continue;
            }

            try {
                // 1. Simpan ke data log alert melalui repository kamu
                $this->repository->create([
                    'medicine_id' => $medicine->id,
                    'alert_type' => $alertType,
                    'status' => 'PENDING',
                    'expiry_date' => $medicine->expired_date,
                    'days_until_expiry' => $daysUntilExpiry,
                    'notes' => $notes
                ]);

                // 2. ✨ PERBAIKAN KUNCI: Ubah 'type' menjadi 'EXPIRED' agar sesuai dengan ENUM database
                \App\Models\Notification::create([
                    'title' => $title,
                    'message' => $notes,
                    'type' => 'EXPIRED', // 🌟 Sesuai dengan enum('LOW_STOCK', 'EXPIRED', 'PREORDER')
                    'is_read' => false,
                    'user_id' => null,   // Global notification
                ]);
            } catch (\Exception $e) {
                \Log::error("Gagal membuat notifikasi obat expired: " . $e->getMessage());
                throw $e; 
            }
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