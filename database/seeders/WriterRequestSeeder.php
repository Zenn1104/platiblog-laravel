<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\WriterRequest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WriterRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::find("2");
        WriterRequest::create([
            'name' => fake()->name(),
            'user_id' => $user->id,
            'phone' => fake()->e164PhoneNumber(),
            'email' => $user->email,
            'birth' => fake()->date('d/M/YYYY'),
            'avatar' => fake()->image(),
            'avatar_url' => fake()->imageUrl(),
            'address' => fake()->address(),
            'gender' => 'male',
            'job' => fake()->jobTitle(),
            'last_education' => fake()->company(),
            'description' => fake()->paragraph(2),
            'writer_status' => 'approve'
        ]);
    }
}
