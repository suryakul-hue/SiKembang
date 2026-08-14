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
        Schema::create('stunting_checks', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('child_name');
    $table->integer('age_months');
    $table->decimal('weight', 5, 2); // Berat Badan (kg)
    $table->decimal('height', 5, 2); // Tinggi Badan (cm)
    $table->decimal('lila', 5, 2)->nullable(); // Lingkar Lengan Atas
    $table->decimal('hb_level', 4, 2)->nullable(); // Kadar Hemoglobin
    $table->string('status'); // Normal, Stunting, Wasting, dll.
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stunting_checks');
    }
};
