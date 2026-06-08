<?php

namespace App\Repositories;

use App\Models\Payment;

class PaymentRepository
{
    public function create(array $data)
    {
        return Payment::create($data);
    }

    public function findByTransaction(int $transactionId)
    {
        return Payment::where(
            'transaction_id',
            $transactionId
        )->first();
    }
}