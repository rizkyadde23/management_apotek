<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $role = Role::where('name', 'ADMIN')->first();

        User::create([
            'role_id' => $role->id,
            'name' => 'Administrator',
            'email' => 'admin@pharmacy.test',
            'password' => Hash::make('password'),
        ]);
    }
}