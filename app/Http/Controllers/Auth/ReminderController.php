<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WeekReminder; 
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ReminderController extends Controller
{
    public function update(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'taken_today' => 'required|boolean', // Tetap gunakan taken_today agar cocok dengan kode dashboard.jsx kamu
        ]);

        $now = Carbon::now();
        $userId = Auth::id();

        // 2. Cek apakah user SUDAH minum di minggu ini (agar tidak double record)
        $alreadyTaken = WeekReminder::where('user_id', $userId)
            ->where('week_number', $now->weekOfYear)
            ->where('year', $now->year)
            ->where('taken_this_week', true)
            ->exists();

        if ($alreadyTaken && $request->taken_today) {
            return back()->with('message', 'Anda sudah mencatat untuk minggu ini!');
        }

        // 3. Simpan atau Update data
        // Menggunakan weekOfYear & year memastikan notif hanya muncul 1x per minggu kalender
        WeekReminder::updateOrCreate(
            [
                'user_id'     => $userId,
                'week_number' => $now->weekOfYear,
                'year'        => $now->year,
            ],
            [
                'taken_this_week' => $request->taken_today,
                'date_taken'      => $request->taken_today ? $now : null,
            ]
        );

        return back()->with('success', 'Catatan tablet mingguan berhasil diperbarui!');
    }
    
}