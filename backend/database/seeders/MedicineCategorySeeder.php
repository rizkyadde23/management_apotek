<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MedicineCategory;

class MedicineCategorySeeder extends Seeder
{
    public function run(): void
    {
        MedicineCategory::insert([
            [
                'name' => 'Analgesik',
                'description' => 'Obat pereda nyeri'
            ],
            [
                'name' => 'Antibiotik',
                'description' => 'Obat infeksi bakteri'
            ],
            [
                'name' => 'Vitamin',
                'description' => 'Suplemen vitamin'
            ],
            [
                'name' => 'Antihistamin',
                'description' => 'Obat alergi'
            ],
            [
                'name' => 'Antasida',
                'description' => 'Obat lambung'
            ]
        ]);
    }
}