<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NotificationSetting;

class NotificationSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        NotificationSetting::firstOrCreate(
            ['id' => 1],
            [
                'low_stock_threshold' => 10,
                'expired_warning_days' => 30,
                'auto_notification' => true,
            ]
        );
    }
}