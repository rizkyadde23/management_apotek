<?php

namespace App\Repositories;

use App\Models\Supplier;

class SupplierRepository
{
    public function paginate(
        ?string $search = null
    ) {
        return Supplier::when(
            $search,
            fn($query) =>
            $query->where(
                'name',
                'like',
                "%{$search}%"
            )
        )
        ->latest()
        ->paginate(10);
    }

    public function create(
        array $data
    ) {
        return Supplier::create($data);
    }

    public function find(
        int $id
    ) {
        return Supplier::findOrFail($id);
    }

    public function update(
        Supplier $supplier,
        array $data
    ) {
        $supplier->update($data);

        return $supplier->fresh();
    }

    public function delete(
        Supplier $supplier
    ) {
        $supplier->delete();
    }
}