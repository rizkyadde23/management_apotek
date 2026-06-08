<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\DB;

use App\Models\Medicine;
use App\Models\Transaction;

use App\Repositories\TransactionRepository;

class TransactionService
{
    public function __construct(
        private TransactionRepository $repository,
        private StockLogService $stockLogService
    ) {}

    public function getAll()
    {
        return $this->repository->paginate();
    }

    public function getById(int $id)
    {
        return $this->repository->find($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {

            $subtotal = 0;

            /*
            |--------------------------------------------------------------------------
            | Validasi Stok & Hitung Subtotal
            |--------------------------------------------------------------------------
            */
            foreach ($data['items'] as $item) {

                $medicine = Medicine::findOrFail(
                    $item['medicine_id']
                );

                if (
                    $medicine->stock <
                    $item['quantity']
                ) {
                    throw new Exception(
                        "Stok {$medicine->name} tidak mencukupi"
                    );
                }

                $subtotal +=
                    $medicine->price *
                    $item['quantity'];
            }

            /*
            |--------------------------------------------------------------------------
            | Hitung Diskon & Total
            |--------------------------------------------------------------------------
            */
            $discount = $data['discount'] ?? 0;

            $total = $subtotal - $discount;

            /*
            |--------------------------------------------------------------------------
            | Simpan Header Transaction
            |--------------------------------------------------------------------------
            */
            $transaction = Transaction::create([
                'transaction_code' => $this->generateTransactionCode(),
                'user_id' => auth()->id(),
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'payment_status' => 'PAID'
            ]);

            /*
            |--------------------------------------------------------------------------
            | Simpan Detail Transaction
            |--------------------------------------------------------------------------
            */
            foreach ($data['items'] as $item) {

                $medicine = Medicine::findOrFail(
                    $item['medicine_id']
                );

                $detailSubtotal =
                    $medicine->price *
                    $item['quantity'];

                $transaction->details()->create([
                    'medicine_id' => $medicine->id,
                    'quantity' => $item['quantity'],
                    'price' => $medicine->price,
                    'subtotal' => $detailSubtotal
                ]);

                /*
                |--------------------------------------------------------------------------
                | Kurangi Stok
                |--------------------------------------------------------------------------
                */
                $this->stockLogService->stockOut(
                    $medicine,
                    $item['quantity'],
                    'Penjualan Obat'
                );
            }

            return $transaction->load([
                'user',
                'details.medicine'
            ]);
        });
    }

    public function generateTransactionCode(): string
    {
        $lastTransaction = Transaction::latest('id')
            ->first();

        $nextNumber = $lastTransaction
            ? $lastTransaction->id + 1
            : 1;

        return 'TRX-' . str_pad(
            $nextNumber,
            6,
            '0',
            STR_PAD_LEFT
        );
    }
}