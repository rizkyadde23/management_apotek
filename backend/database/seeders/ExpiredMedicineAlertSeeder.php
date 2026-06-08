<?php

namespace Database\Seeders;

use App\Models\ExpiredMedicineAlert;
use App\Models\Medicine;
use Illuminate\Database\Seeder;

class ExpiredMedicineAlertSeeder extends Seeder
{
    public function run(): void
    {
        $medicines = Medicine::where('is_active', true)
            ->whereNotNull('expired_date')
            ->limit(5)
            ->get();

        foreach ($medicines as $medicine) {
            $daysUntilExpiry = now()->diffInDays($medicine->expired_date);

            ExpiredMedicineAlert::create([
                'medicine_id' => $medicine->id,
                'alert_type' => $daysUntilExpiry <= 7 ? 'CRITICAL' : 'WARNING',
                'status' => 'PENDING',
                'expiry_date' => $medicine->expired_date,
                'days_until_expiry' => $daysUntilExpiry,
                'notes' => "Demo alert untuk {$medicine->name}"
            ]);
        }
    }
}
