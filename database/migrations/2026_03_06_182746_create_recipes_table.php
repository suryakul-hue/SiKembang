<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('age_group'); 
            $table->string('category')->nullable();
            $table->integer('cooking_time'); 
            $table->integer('calories');
            $table->string('difficulty')->default('Mudah'); 
            $table->text('benefits')->nullable();
            $table->string('emoji')->default('🍽️');
            $table->string('image')->nullable();
            
            // Statistik
            $table->float('rating')->default(0);
            $table->integer('reviews')->default(0);
            
            // Kolom JSON untuk menyimpan Array
            $table->json('nutrition_tags')->nullable();
            $table->json('ingredients')->nullable();
            $table->json('instructions')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};