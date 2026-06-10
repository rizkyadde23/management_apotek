<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\MedicineCategory;
use App\Services\MedicineCategoryService;

use App\Http\Requests\MedicineCategory\StoreMedicineCategoryRequest;
use App\Http\Requests\MedicineCategory\UpdateMedicineCategoryRequest;

class MedicineCategoryController extends BaseController
{
    public function __construct(
        private MedicineCategoryService $service
    ) {}

    public function index()
    {
        return $this->success(
            $this->service->getAll()
        );
    }

    public function show(
        MedicineCategory $medicine_category
    )
    {
        return $this->success(
            $medicine_category,
            'Detail kategori berhasil diambil'
        );
    }

    public function store(
        StoreMedicineCategoryRequest $request
    )
    {
        return $this->success(
            $this->service->create(
                $request->validated()
            ),
            'Kategori berhasil dibuat',
            201
        );
    }

    public function update(
        UpdateMedicineCategoryRequest $request,
        MedicineCategory $medicine_category
    )
    {
        return $this->success(
            $this->service->update(
                $medicine_category,
                $request->validated()
            ),
            'Kategori berhasil diperbarui'
        );
    }

    public function destroy(
        MedicineCategory $medicine_category
    )
    {
        $this->service->delete(
            $medicine_category
        );

        return $this->success(
            null,
            'Kategori berhasil dihapus'
        );
    }
}