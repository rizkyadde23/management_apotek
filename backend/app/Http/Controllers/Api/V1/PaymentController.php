<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Transaction;

use App\Services\PaymentService;

use App\Http\Requests\Payment\PayTransactionRequest;

class PaymentController extends BaseController
{
    public function __construct(
        private PaymentService $service
    ) {}

    public function pay(
        PayTransactionRequest $request,
        Transaction $transaction
    )
    {
        return $this->success(
            $this->service->pay(
                $transaction,
                $request->validated()
            ),
            'Pembayaran berhasil'
        );
    }
}