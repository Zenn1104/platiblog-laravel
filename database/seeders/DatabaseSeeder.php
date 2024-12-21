<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(50)->create()->each(function($user) {
            $user->assignRole('reader');
        });

    //    $admin =  User::factory()->create([
    //         'name' => 'Admin User',
    //         'email' => 'Admin@example.com',
    //         'email_verified_at' => now(),
    //         'password' => Hash::make('password'),
    //         'birth' => 'test, 11-11-1111',
    //         'avatar' => fake()->image(),
    //         'avatar_url' => fake()->imageUrl(),
    //         'address' => 'test',
    //         'remember_token' => Str::random(10),
    //     ]);
    //     $admin->assignRole('admin');
    }
}
