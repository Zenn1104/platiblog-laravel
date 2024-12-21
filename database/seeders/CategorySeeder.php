<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create([
            'name' => 'design',
            'slug' => 'design',
            'description' => 'for design blog'
        ]);
        Category::create([
            'name' => 'cyber security',
            'slug' => 'cyber-security',
            'description' => 'for cyber security blog'
        ]);
        Category::create([
            'name' => 'web design',
            'slug' => 'web-design',
            'description' => 'for web design blog'
        ]);
        Category::create([
            'name' => 'mobile app',
            'slug' => 'mobile-app',
            'description' => 'for mobile app blog'
        ]);
        Category::create([
            'name' => 'food',
            'slug' => 'food',
            'description' => 'for food blog'
        ]);
        Category::create([
            'name' => 'politic',
            'slug' => 'politic',
            'description' => 'for politic app blog'
        ]);
        Category::create([
            'name' => 'photogrhapy',
            'slug' => 'photogrhapy',
            'description' => 'for photogrhapy blog'
        ]);
        Category::create([
            'name' => 'programming',
            'slug' => 'programming',
            'description' => 'for programming blog'
        ]);
        Category::create([
            'name' => 'math',
            'slug' => 'math',
            'description' => 'for math blog'
        ]);
        Category::create([
            'name' => 'mental health',
            'slug' => 'mental-health',
            'description' => 'for mental health blog'
        ]);
    }
}
