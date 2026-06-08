<?php

namespace App\Repositories;

use App\Models\MedicineCategory;

class MedicineCategoryRepository
{
    public function paginate()
    {
        return MedicineCategory::latest()
            ->paginate(10);
    }

    public function create(array $data)
    {
        return MedicineCategory::create($data);
    }

    public function find(int $id)
    {
        return MedicineCategory::findOrFail($id);
    }

    public function update(
        MedicineCategory $category,
        array $data
    ) {
        $category->update($data);

        return $category->fresh();
    }

    public function delete(
        MedicineCategory $category
    ) {
        $category->delete();
    }
}