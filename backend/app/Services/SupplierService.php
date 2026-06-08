<?php

namespace App\Services;

use App\Models\Supplier;
use App\Repositories\SupplierRepository;

class SupplierService
{
    public function __construct(
        private SupplierRepository $repository
    ) {}

    public function getAll(
        ?string $search = null
    ) {
        return $this->repository
            ->paginate($search);
    }

    public function create(
        array $data
    ) {
        return $this->repository
            ->create($data);
    }

    public function update(
        Supplier $supplier,
        array $data
    ) {
        return $this->repository
            ->update(
                $supplier,
                $data
            );
    }

    public function delete(
        Supplier $supplier
    ) {
        $this->repository
            ->delete($supplier);
    }
}