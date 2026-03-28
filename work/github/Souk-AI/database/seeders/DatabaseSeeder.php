<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Admin Role',
            'email' => 'admin@souk.ai',
            'password' => \Illuminate\Support\Facades\Hash::make('123456'),
            'role' => \App\Enums\UserRole::ADMIN,
        ]);

        User::factory()->create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
