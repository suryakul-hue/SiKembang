<?php
// app/Models/StuntingRecord.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StuntingRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'nama_anak', 'tanggal_lahir', 'jenis_kelamin',
        'berat_badan', 'tinggi_badan', 'lingkar_lengan', 'hemoglobin',
        'tanggal_pemeriksaan', 'umur_bulan', 'imt',
        'stunting_status', 'wasting_status', 'anemia_status',
        'lila_status', 'severity', 'summary', 'recommendations',
    ];

    protected $casts = [
        'tanggal_lahir'       => 'date',
        'tanggal_pemeriksaan' => 'date',
        'berat_badan'         => 'decimal:2',
        'tinggi_badan'        => 'decimal:2',
        'lingkar_lengan'      => 'decimal:2',
        'hemoglobin'          => 'decimal:2',
        'imt'                 => 'decimal:2',
        'recommendations'     => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isHealthy(): bool
    {
        return $this->stunting_status === 'normal'
            && $this->wasting_status  === 'normal'
            && $this->anemia_status   === 'normal'
            && $this->lila_status     === 'normal';
    }

    public function getAgeDisplayAttribute(): string
    {
        $months = $this->umur_bulan;
        if ($months < 12) return "{$months} bulan";
        $years = intdiv($months, 12);
        $rem   = $months % 12;
        return $rem > 0 ? "{$years} tahun {$rem} bulan" : "{$years} tahun";
    }
}