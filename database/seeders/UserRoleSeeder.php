<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::updateOrCreate(
            ['email' => 'admin@souk.tn'],
            [
                'name' => 'Admin',
                'family_name' => 'System',
                'password' => Hash::make('123456789'),
                'role' => 'ADMIN',
            ]
        );

        // Store Owner
        User::updateOrCreate(
            ['email' => 'store@souk.tn'],
            [
                'name' => 'Store',
                'family_name' => 'Owner',
                'password' => Hash::make('123456789'),
                'role' => 'STORE',
            ]
        );

        // Client
        User::updateOrCreate(
            ['email' => 'client@souk.tn'],
            [
                'name' => 'John',
                'family_name' => 'Doe',
                'password' => Hash::make('123456789'),
                'role' => 'CLIENT',
            ]
        );
    }
}
