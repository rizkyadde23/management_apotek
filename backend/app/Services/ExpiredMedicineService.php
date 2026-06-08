<?php

namespace App\Services;

use App\Repositories\ExpiredMedicineRepository;

class ExpiredMedicineService
{
    public function __construct(
        private ExpiredMedicineRepository $repository
    ) {}

    public function getExpired()
    {
        return $this->repository
            ->getExpiredMedicines();
    }

    public function getExpiringSoon()
    {
        return $this->repository
            ->getExpiringSoon();
    }

    public function summary()
    {
        return [
            'expired_count' =>
                $this->repository->countExpired(),

            'expiring_soon_count' =>
                $this->repository->countExpiringSoon()
        ];
    }
}