<?php

namespace App\Services;

use App\Repositories\MedicineCategoryRepository;

class MedicineCategoryService
{
    public function __construct(
        private MedicineCategoryRepository $repository
    ) {}

    public function getAll()
    {
        return $this->repository->paginate();
    }

    public function create(array $data)
    {
        return $this->repository->create($data);
    }
}