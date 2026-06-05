<?php

namespace Database\Seeders;

use App\Models\TransactionDetail;
use Illuminate\Database\Seeder;

class TransactionDetailSeeder extends Seeder
{
    public function run(): void
    {
        TransactionDetail::create([
            'transaction_id' => 1,
            'medicine_id' => 1,
            'quantity' => 2,
            'price' => 5000,
            'subtotal' => 10000
        ]);
    }
}