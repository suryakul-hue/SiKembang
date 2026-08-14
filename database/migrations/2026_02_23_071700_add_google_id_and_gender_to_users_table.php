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
        Schema::table('users', function (Blueprint $table) {
            // Google ID buat simpan identitas dari Google
            $table->string('google_id')->nullable()->unique()->after('id');
            
            // Tambahkan gender dan avatar (opsional tapi berguna buat profil)
            $table->string('gender')->nullable()->after('email');
            $table->string('avatar')->nullable()->after('gender');

            // Penting: Buat password jadi nullable karena user Google tidak punya password lokal di awal
            $table->string('password')->nullable()->change(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'gender', 'avatar']);
            // Balikin password jadi tidak boleh null jika migrasi di-rollback
            $table->string('password')->nullable(false)->change();
        });
    }
};