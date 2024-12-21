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
        Schema::create('writer_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(false);
            $table->string('name', 100)->nullable();
            $table->string('birth')->nullable();
            $table->string('avatar')->nullable();
            $table->string('avatar_url')->nullable();
            $table->enum('gender', ['male', 'female', 'etc'])->default('etc');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('job')->nullable();
            $table->string('last_education')->nullable();
            $table->text('description')->nullable();
            $table->enum('writer_status', ['pending', 'approve', 'rejected'])->default('pending');
            $table->timestamps();

            $table->foreign('user_id')->on('users')->references('id')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('writer_requests');
    }
};
