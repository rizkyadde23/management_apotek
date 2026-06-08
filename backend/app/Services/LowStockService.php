<?php

namespace App\Services;

use App\Repositories\LowStockRepository;

class LowStockService
{
    public function __construct(
        private LowStockRepository $repository
    ) {}

    public function getLowStockMedicines()
    {
        return $this->repository
            ->getLowStockMedicines();
    }

    public function getOutOfStockMedicines()
    {
        return $this->repository
            ->getOutOfStock();
    }

    public function countLowStock()
    {
        return $this->repository
            ->countLowStock();
    }
}