<?php

namespace App\Services;

use Exception;
use App\Models\Transaction;

use App\Repositories\PaymentRepository;

class PaymentService
{
    public function __construct(
        private PaymentRepository $repository
    ) {}

    public function pay(
        Transaction $transaction,
        array $data
    )
    {
        if (
            $transaction->payment_status === 'PAID'
        ) {
            throw new Exception(
                'Transaksi sudah dibayar'
            );
        }

        if (
            $data['amount_paid']
            < $transaction->total
        ) {
            throw new Exception(
                'Nominal pembayaran kurang'
            );
        }

        $change =
            $data['amount_paid']
            - $transaction->total;

        $payment = $this->repository->create([
            'transaction_id' => $transaction->id,
            'amount_paid' => $data['amount_paid'],
            'change_amount' => $change,
            'payment_method' => $data['payment_method'],
            'paid_at' => now()
        ]);

        $transaction->update([
            'payment_status' => 'PAID'
        ]);

        return $payment;
    }
}