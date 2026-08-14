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
        Schema::create('week_reminders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->integer('week_number');
    $table->integer('year');
    $table->boolean('taken_this_week')->default(false);
    $table->date('date_taken')->nullable();
    $table->timestamps();
    
    $table->unique(['user_id', 'week_number', 'year']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('week_reminders');
    }
};
