<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Medicine;
use App\Services\MedicineService;

use App\Http\Requests\Medicine\StoreMedicineRequest;
use App\Http\Requests\Medicine\UpdateMedicineRequest;

class MedicineController extends BaseController
{
    public function __construct(
        private MedicineService $medicineService
    ) {}

    /**
     * Display a listing of medicines.
     */
    public function index()
    {
        return $this->success(
            $this->medicineService->getAll(
                request('search')
            ),
            'Data obat berhasil diambil'
        );
    }

    /**
     * Store a newly created medicine.
     */
    public function store(
        StoreMedicineRequest $request
    ) {
        $medicine = $this->medicineService->create(
            $request->validated()
        );

        return $this->success(
            $medicine,
            'Data obat berhasil ditambahkan',
            201
        );
    }

    /**
     * Display the specified medicine.
     */
    public function show(
        Medicine $medicine
    ) {
        return $this->success(
            $medicine->load([
                'category',
                'supplier'
            ]),
            'Detail obat berhasil diambil'
        );
    }

    /**
     * Update the specified medicine.
     */
    public function update(
        UpdateMedicineRequest $request,
        Medicine $medicine
    ) {
        $medicine = $this->medicineService->update(
            $medicine,
            $request->validated()
        );

        return $this->success(
            $medicine->load([
                'category',
                'supplier'
            ]),
            'Data obat berhasil diperbarui'
        );
    }

    /**
     * Remove the specified medicine.
     */
    public function destroy(
        Medicine $medicine
    ) {
        $this->medicineService->delete(
            $medicine
        );

        return $this->success(
            null,
            'Data obat berhasil dihapus'
        );
    }
}