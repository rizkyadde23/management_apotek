<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\NotificationSettingService;
use App\Http\Requests\Notification\UpdateNotificationSettingRequest;

class NotificationSettingController extends BaseController
{
    public function __construct(
        private NotificationSettingService $service
    ) {}

    /**
     * Ambil notification setting
     */
    public function show()
    {
        return $this->success(
            $this->service->getSetting(),
            'Notification setting berhasil diambil'
        );
    }

    /**
     * Update notification setting
     */
    public function update(
        UpdateNotificationSettingRequest $request
    ) {
        return $this->success(
            $this->service->updateSetting(
                $request->validated()
            ),
            'Notification setting berhasil diperbarui'
        );
    }
}