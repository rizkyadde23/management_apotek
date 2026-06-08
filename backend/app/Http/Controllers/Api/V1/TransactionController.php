<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\TransactionService;
use App\Http\Requests\Transaction\StoreTransactionRequest;

class TransactionController extends BaseController
{
    public function __construct(
        private TransactionService $transactionService
    ) {}

    public function index()
    {
        return $this->success(
            $this->transactionService->getAll(),
            'Data penjualan berhasil diambil'
        );
    }

    public function show(int $id)
    {
        return $this->success(
            $this->transactionService->getById($id),
            'Detail penjualan berhasil diambil'
        );
    }

    public function store(
        StoreTransactionRequest $request
    ) {
        return $this->success(
            $this->transactionService->create(
                $request->validated()
            ),
            'Transaksi berhasil dibuat',
            201
        );
    }
}