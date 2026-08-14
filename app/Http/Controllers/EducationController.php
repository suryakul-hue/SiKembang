<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class EducationController extends Controller
{
    public function index()
    {
        return Inertia::render('Education/Index', [
            'topics' => [
                [
                    'title' => 'Pentingnya Gizi Seimbang',
                    'description' => 'Penuhi kebutuhan protein, zat besi, vitamin, dan mineral untuk mendukung tumbuh kembang anak.',
                    'icon' => '🥗',
                ],
                [
                    'title' => 'Cegah Stunting',
                    'description' => 'Pantau pola makan, berat badan, tinggi badan, dan kunjungan rutin ke tenaga kesehatan.',
                    'icon' => '📏',
                ],
                [
                    'title' => 'Tablet Tambah Darah',
                    'description' => 'Minum tablet sesuai jadwal dan catat konsumsi untuk menjaga kesehatan ibu dan anak.',
                    'icon' => '💊',
                ],
            ],
        ]);
    }
}
