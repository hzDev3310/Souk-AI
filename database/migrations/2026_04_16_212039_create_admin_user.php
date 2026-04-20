<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $adminId = Str::uuid();
        
        $exists = DB::table("users")->where("email", "admin@souk.tn")->exists();
        
        if (!$exists) {
            DB::table("users")->insert([
                "id" => $adminId,
                "name" => "Admin",
                "family_name" => "Souk",
                "email" => "admin@souk.tn",
                "email_verified_at" => now(),
                "password" => bcrypt("123456789"),
                "role" => "admin",
                "created_at" => now(),
                "updated_at" => now(),
            ]);

            DB::table("admins")->insert([
                "id" => Str::uuid(),
                "user_id" => $adminId,
                "platformCommissionAdmin" => 10.00,
                "platformCommissionShare" => 5.00,
                "created_at" => now(),
                "updated_at" => now(),
            ]);
        }
    }

    public function down(): void
    {
        $user = DB::table("users")->where("email", "admin@souk.tn")->first();
        if ($user) {
            DB::table("admins")->where("user_id", $user->id)->delete();
            DB::table("users")->where("id", $user->id)->delete();
        }
    }
};
