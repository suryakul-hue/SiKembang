<?php

namespace App\Http\Controllers;

use App\Models\StuntingRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StuntingController extends Controller
{
    /**
     * Menampilkan halaman form deteksi utama
     */
    public function index()
    {
        // Mengarahkan ke halaman StuntingDetection.jsx
        return Inertia::render('Stunting');
    }

    /**
     * Menyimpan hasil pemeriksaan baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_anak'           => 'required|string|max:255',
            'tanggal_lahir'       => 'required|date',
            'jenis_kelamin'       => 'required|in:L,P',
            'berat_badan'         => 'required|numeric|min:0.1',
            'tinggi_badan'        => 'required|numeric|min:1',
            'lingkar_lengan'      => 'required|numeric|min:0.1',
            'hemoglobin'          => 'required|numeric|min:0.1',
            'tanggal_pemeriksaan' => 'required|date',
            'umur_bulan'          => 'required|integer|min:0',
            'imt'                 => 'nullable|numeric',
            'hasil'               => 'required|array',
        ]);

        $hasil = $validated['hasil'];

        StuntingRecord::create([
            'user_id'             => Auth::id(),
            'nama_anak'           => $validated['nama_anak'],
            'tanggal_lahir'       => $validated['tanggal_lahir'],
            'jenis_kelamin'       => $validated['jenis_kelamin'],
            'berat_badan'         => $validated['berat_badan'],
            'tinggi_badan'        => $validated['tinggi_badan'],
            'lingkar_lengan'      => $validated['lingkar_lengan'],
            'hemoglobin'          => $validated['hemoglobin'],
            'tanggal_pemeriksaan' => $validated['tanggal_pemeriksaan'],
            'umur_bulan'          => $validated['umur_bulan'],
            'imt'                 => $validated['imt'] ?? null,
            'stunting_status'     => $hasil['stuntingStatus'] ?? 'normal',
            'wasting_status'      => $hasil['wastingStatus']  ?? 'normal',
            'anemia_status'       => $hasil['anemiaStatus']   ?? 'normal',
            'lila_status'         => $hasil['lilaStatus']     ?? 'normal',
            'severity'            => $hasil['severity']       ?? 'normal',
            'summary'             => $hasil['summary']        ?? null,
            'recommendations'     => $hasil['recommendations'] ?? [],
        ]);

        return redirect()->route('stunting.history')->with('success', 'Data pemeriksaan berhasil disimpan! 🎉');
    }

    /**
     * Menampilkan riwayat pemeriksaan user
     */
    public function history(Request $request)
    {
        $query = StuntingRecord::where('user_id', Auth::id())
            ->orderBy('tanggal_pemeriksaan', 'desc')
            ->orderBy('created_at', 'desc');

        // Logic Filter Pencarian
        if ($request->filled('search')) {
            $query->where('nama_anak', 'like', '%' . $request->search . '%');
        }

        // Logic Filter Status Kesehatan
        if ($request->filled('status')) {
            $status = $request->status;
            if ($status === 'healthy') {
                $query->where('stunting_status', 'normal')
                      ->where('wasting_status',  'normal')
                      ->where('anemia_status',   'normal')
                      ->where('lila_status',     'normal');
            } elseif ($status === 'stunting') {
                $query->where('stunting_status', 'stunting');
            } elseif ($status === 'risk') {
                $query->where(function ($q) {
                    $q->where('stunting_status', 'risk')
                      ->orWhere('wasting_status', 'wasting')
                      ->orWhere('anemia_status', '!=', 'normal')
                      ->orWhere('lila_status', '!=', 'normal');
                });
            }
        }

        $records = $query->paginate(10)->withQueryString();

        // Hitung Statistik untuk Dashboard Riwayat
        $stats = [
            'total'    => StuntingRecord::where('user_id', Auth::id())->count(),
            'healthy'  => StuntingRecord::where('user_id', Auth::id())
                            ->where('stunting_status', 'normal')->where('wasting_status', 'normal')
                            ->where('anemia_status', 'normal')->where('lila_status', 'normal')->count(),
            'stunting' => StuntingRecord::where('user_id', Auth::id())
                            ->where('stunting_status', 'stunting')->count(),
            'at_risk'  => StuntingRecord::where('user_id', Auth::id())
                            ->where(function ($q) {
                                $q->where('stunting_status', 'risk')
                                  ->orWhere('wasting_status', 'wasting')
                                  ->orWhere('anemia_status', '!=', 'normal')
                                  ->orWhere('lila_status', '!=', 'normal');
                            })->count(),
        ];

        return Inertia::render('StuntingHistory', [
            'records' => $records,
            'stats'   => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Menampilkan detail satu pemeriksaan
     */
    public function show(StuntingRecord $stuntingRecord)
    {
        abort_if($stuntingRecord->user_id !== Auth::id(), 403, 'Akses ditolak.');
        return Inertia::render('StuntingDetail', ['record' => $stuntingRecord]);
    }

    /**
     * Menghapus data pemeriksaan
     */
    public function destroy(StuntingRecord $stuntingRecord)
    {
        abort_if($stuntingRecord->user_id !== Auth::id(), 403, 'Akses ditolak.');
        $stuntingRecord->delete();
        return back()->with('success', 'Data pemeriksaan berhasil dihapus.');
    }
}