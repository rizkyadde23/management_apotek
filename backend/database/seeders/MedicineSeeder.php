<?php

namespace Database\Seeders;

use App\Models\Medicine;
use Illuminate\Database\Seeder;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        // Medicine::insert([
        //     [
        //         'supplier_id' => 1,
        //         'category_id' => 1,
        //         'code' => 'OBT001',
        //         'batch_number' => 'BT2026001',
        //         'name' => 'Paracetamol',
        //         'description' => 'Pereda nyeri dan demam',
        //         'type' => 'GENERIC',
        //         'stock' => 50,
        //         'minimum_stock' => 10,
        //         'price' => 5000,
        //         'expired_date' => '2027-12-31',
        //         'is_active' => true,
        //         'created_at' => now(),
        //         'updated_at' => now()
        //     ],
        //     [
        //         'supplier_id' => 2,
        //         'category_id' => 3,
        //         'code' => 'OBT002',
        //         'batch_number' => 'BT2026002',
        //         'name' => 'Vitamin C',
        //         'description' => 'Suplemen Vitamin C',
        //         'type' => 'NON_GENERIC',
        //         'stock' => 30,
        //         'minimum_stock' => 10,
        //         'price' => 15000,
        //         'expired_date' => '2028-06-30',
        //         'is_active' => true,
        //         'created_at' => now(),
        //         'updated_at' => now()
        //     ]
        // ]);
    }
}