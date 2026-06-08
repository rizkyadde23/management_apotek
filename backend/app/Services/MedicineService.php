<?php

namespace App\Services;

use App\Models\Medicine;
use App\Repositories\MedicineRepository;

class MedicineService
{
    public function __construct(
        private MedicineRepository $repository
    ) {}

    public function getAll(
        ?string $search = null
    )
    {
        return $this->repository
            ->paginate($search);
    }

    public function getById(
        int $id
    )
    {
        return $this->repository
            ->find($id);
    }

    public function create(
        array $data
    )
    {
        return $this->repository
            ->create($data);
    }

    public function update(
        Medicine $medicine,
        array $data
    )
    {
        return $this->repository
            ->update(
                $medicine,
                $data
            );
    }

    public function delete(
        Medicine $medicine
    )
    {
        return $this->repository
            ->delete($medicine);
    }
}