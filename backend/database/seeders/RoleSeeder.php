<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'ADMIN',
            'APOTEKER',
            'KASIR',
            'OWNER',
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate([
                'name' => $role
            ]);
        }
    }
}