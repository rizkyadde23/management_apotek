<?php

namespace App\Services;

use App\Repositories\NotificationSettingRepository;

class NotificationSettingService
{
    public function __construct(
        private NotificationSettingRepository $repository
    ) {}

    /**
     * Ambil setting notifikasi.
     */
    public function getSetting()
    {
        return $this->repository->first();
    }

    /**
     * Update setting notifikasi.
     */
    public function updateSetting(array $data)
    {
        return $this->repository->update($data);
    }
}