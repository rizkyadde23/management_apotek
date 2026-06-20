<?php

namespace App\Repositories;

use App\Models\NotificationSetting;

class NotificationSettingRepository
{
    public function first()
    {
        return NotificationSetting::first();
    }

    public function update(array $data)
    {
        $setting = NotificationSetting::first();

        if (!$setting) {
            $setting = NotificationSetting::create($data);
        } else {
            $setting->update($data);
        }

        return $setting->fresh();
    }
}