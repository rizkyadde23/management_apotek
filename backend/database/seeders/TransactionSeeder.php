<?php

namespace Database\Seeders;

use App\Models\Transaction;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        Transaction::create([
            'transaction_code' => 'TRX-000001',
            'user_id' => 1,
            'subtotal' => 10000,
            'discount' => 0,
            'total' => 10000,
            'payment_status' => 'PAID'
        ]);
    }
}