<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Category;
use App\Models\WriterRequest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $category = Category::find("1");
        $writer = WriterRequest::find("1");
        Blog::create([
            'title' => fake()->name(),
            'category_id' => $category->id,
            'writer_id' => $writer->id,
            'thumbnail' => fake()->image(),
            'thumbnail_url' => fake()->imageUrl(),
            'content' => fake()->paragraphs(30, true),
        ]);
    }
}
