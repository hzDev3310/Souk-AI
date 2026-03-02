<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@ecomarket.test'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'owner@ecomarket.test'],
            [
                'name' => 'Store Owner',
                'password' => Hash::make('password'),
                'role' => 'store_owner',
            ]
        );

        User::updateOrCreate(
            ['email' => 'customer@ecomarket.test'],
            [
                'name' => 'Customer User',
                'password' => Hash::make('password'),
                'role' => 'customer',
            ]
        );
    }
}
