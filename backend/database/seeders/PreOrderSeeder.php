<?php

namespace Database\Seeders;

use App\Models\PreOrder;
use Illuminate\Database\Seeder;

class PreOrderSeeder extends Seeder
{
    public function run(): void
    {
        PreOrder::create([
            'medicine_id' => 1,
            'user_id' => 1,
            'customer_name' => 'Budi Santoso',
            'customer_phone' => '08123456789',
            'quantity' => 5,
            'status' => 'PENDING',
            'estimated_arrival_date' => now()->addDays(3),
            'notes' => 'Menunggu restock supplier'
        ]);
    }
}