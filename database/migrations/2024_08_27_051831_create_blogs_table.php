<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title', 200);
            $table->string('thumbnail')->nullable();
            $table->string('thumbnail_url')->nullable();
            $table->text('content');
            $table->enum('blog_status', ['pending', 'approve', 'rejected'])->default('pending');
            $table->unsignedBigInteger('writer_id'); // Tambahkan kolom writer_id
            $table->unsignedBigInteger('category_id'); // Tambahkan kolom category_id
            $table->timestamps();

            // Definisikan foreign key setelah kolom ditambahkan
            $table->foreign('writer_id')->references('id')->on('writer_requests')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
