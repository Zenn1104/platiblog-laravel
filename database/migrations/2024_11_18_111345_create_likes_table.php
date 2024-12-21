<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLikesTable extends Migration
{
    public function up()
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['like', 'unlike']); 
            $table->timestamps();

            $table->unique(['blog_id', 'user_id']); 
        });
    }

    public function down()
    {
        Schema::dropIfExists('likes');
    }
}
