<?php

namespace App\Services;

use App\Repositories\MedicineCategoryRepository;
use App\Models\MedicineCategory;

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

    public function update(
    MedicineCategory $medicine_category,
    array $data
)
{
    return $this->repository->update(
        $medicine_category,
        $data
    );
}

public function delete(
    MedicineCategory $medicine_category
)
{
    return $this->repository->delete(
        $medicine_category
    );
}
}