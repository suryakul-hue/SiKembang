<?php
// database/migrations/2024_01_01_000000_create_stunting_records_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stunting_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nama_anak');
            $table->date('tanggal_lahir');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->decimal('berat_badan', 5, 2);
            $table->decimal('tinggi_badan', 5, 2);
            $table->decimal('lingkar_lengan', 4, 2);
            $table->decimal('hemoglobin', 4, 2);
            $table->date('tanggal_pemeriksaan');
            $table->integer('umur_bulan');
            $table->decimal('imt', 5, 2)->nullable();
            $table->enum('stunting_status', ['normal', 'risk', 'stunting'])->default('normal');
            $table->enum('wasting_status',  ['normal', 'wasting'])->default('normal');
            $table->enum('anemia_status',   ['normal', 'mild', 'severe'])->default('normal');
            $table->enum('lila_status',     ['normal', 'moderate', 'severe'])->default('normal');
            $table->enum('severity',        ['normal', 'moderate', 'severe'])->default('normal');
            $table->text('summary')->nullable();
            $table->json('recommendations')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stunting_records');
    }
};