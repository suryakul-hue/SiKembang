<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pilih Gender - SiKembang</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
    </style>
</head>
<body class="bg-slate-50 min-h-screen flex items-center justify-center p-4">

    <!-- Card Utama Berwarna Putih Bersih -->
    <div class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 w-full max-w-md transition-all">
        
        <!-- Form murni berjalan di halaman yang sama (Tanpa target="_blank") -->
        <form action="{{ route('gender.update') }}" method="POST" class="space-y-6">
            @csrf
            
            <!-- Header -->
            <div class="text-center space-y-2">
                <div class="inline-flex p-3 bg-sky-50 text-sky-500 rounded-2xl text-2xl mb-2">
                    ✨
                </div>
                <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Lengkapi Profil Anda</h2>
                <p class="text-sm text-slate-500 max-w-xs mx-auto">Silakan pilih jenis kelamin untuk menyesuaikan fitur pemantauan kesehatan Anda.</p>
            </div>

            <!-- Pesan Error Validasi Laravel jika ada -->
            @if ($errors->any())
                <div class="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Pilihan jenis kelamin wajib diisi.</span>
                </div>
            @endif

            <!-- Pilihan Radio Button -->
            <div class="grid grid-cols-2 gap-4">
                
                <!-- Opsi Laki-laki / Cowo -->
                <label class="cursor-pointer group relative">
                    <input type="radio" name="gender" value="Laki-laki" class="hidden peer" required>
                    <div class="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 text-center hover:bg-slate-100/50 peer-checked:border-sky-500 peer-checked:bg-sky-50/50 transition-all duration-200">
                        <span class="text-4xl block transform group-hover:scale-110 transition-transform duration-200">👦</span>
                        <p class="text-sm font-bold mt-3 text-slate-700 peer-checked:text-sky-600">Laki-laki</p>
                        <p class="text-xs text-slate-400 mt-1 font-medium">Cowo</p>
                    </div>
                </label>

                <!-- Opsi Perempuan / Cewe -->
                <label class="cursor-pointer group relative">
                    <input type="radio" name="gender" value="Perempuan" class="hidden peer" required>
                    <div class="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 text-center hover:bg-slate-100/50 peer-checked:border-pink-500 peer-checked:bg-pink-50/50 transition-all duration-200">
                        <span class="text-4xl block transform group-hover:scale-110 transition-transform duration-200">👧</span>
                        <p class="text-sm font-bold mt-3 text-slate-700 peer-checked:text-pink-600">Perempuan</p>
                        <p class="text-xs text-slate-400 mt-1 font-medium">Cewe</p>
                    </div>
                </label>
                
            </div>

            <!-- Info Box Ringkas -->
            <div class="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl text-xs text-slate-500 leading-relaxed">
                ℹ️ Akun perempuan otomatis mengaktifkan fitur pengingat mingguan konsumsi **Tablet Tambah Darah (TTD)** untuk pencegahan anemia.
            </div>

            <!-- Tombol Submit Modern -->
            <button type="submit" class="w-full bg-sky-500 hover:bg-sky-600 active:scale-[0.98] text-white font-semibold py-3.5 rounded-2xl transition-all shadow-lg shadow-sky-500/20 text-sm tracking-wide">
                Simpan & Lanjutkan
            </button>
        </form>
    </div>

</body>
</html>