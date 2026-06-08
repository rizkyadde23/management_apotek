<?php

namespace App\Repositories;

use App\Models\Medicine;

class MedicineRepository
{
    public function paginate(
        ?string $search = null
    ) {

        return Medicine::with([
                'category',
                'supplier'
            ])
            ->when(
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
        return Medicine::create($data);
    }

    public function find(
        int $id
    ) {
        return Medicine::with([
            'category',
            'supplier'
        ])->findOrFail($id);
    }

    public function update(
        Medicine $medicine,
        array $data
    ) {
        $medicine->update($data);

        return $medicine->fresh();
    }

    public function delete(
        Medicine $medicine
    ) {
        $medicine->delete();
    }
}