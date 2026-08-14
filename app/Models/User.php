<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Atribut yang bisa diisi secara massal (Mass Assignable).
     * Gabungkan semua kolom baru kamu di sini.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id', 
        'gender',    
        'role',      
        'avatar',    
        'child_name',   // <-- Ini yang baru ditambahkan
        'child_dob',    // <-- Ini yang baru ditambahkan
        'child_gender', // <-- Ini yang baru ditambahkan
    ];

    /**
     * Atribut yang disembunyikan saat data diubah jadi JSON.
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Casting atribut.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Helper: Mendapatkan inisial nama user.
     */
    public function initials(): string
    {
        return Str::of($this->name)
            ->explode(' ')
            ->take(2)
            ->map(fn ($word) => Str::substr($word, 0, 1))
            ->implode('');
    }

    /**
     * Helper: Cek apakah user adalah admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}