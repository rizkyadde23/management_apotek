<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Supplier;
use App\Services\SupplierService;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;

class SupplierController extends BaseController
{
    public function __construct(
        private SupplierService $supplierService
    ) {}

    /**
     * Display a listing of suppliers.
     */
    public function index()
    {
        return $this->success(
            $this->supplierService->getAll(
                request('search')
            ),
            'Data supplier berhasil diambil'
        );
    }

    /**
     * Store a newly created supplier.
     */
    public function store(
        StoreSupplierRequest $request
    ) {
        $supplier = $this->supplierService->create(
            $request->validated()
        );

        return $this->success(
            $supplier,
            'Supplier berhasil dibuat',
            201
        );
    }

    /**
     * Display the specified supplier.
     */
    public function show(
        Supplier $supplier
    ) {
        return $this->success(
            $supplier,
            'Detail supplier berhasil diambil'
        );
    }

    /**
     * Update the specified supplier.
     */
    public function update(
        UpdateSupplierRequest $request,
        Supplier $supplier
    ) {
        $supplier = $this->supplierService->update(
            $supplier,
            $request->validated()
        );

        return $this->success(
            $supplier,
            'Supplier berhasil diperbarui'
        );
    }

    /**
     * Remove the specified supplier.
     */
    public function destroy(
        Supplier $supplier
    ) {
        $this->supplierService->delete(
            $supplier
        );

        return $this->success(
            null,
            'Supplier berhasil dihapus'
        );
    }
}