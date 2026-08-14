<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lengkapi Profil - PKM App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Plus Jakarta Sans', 'sans-serif'] },
                    colors: { primary: { 600: '#4f46e5' } }
                }
            }
        }
    </script>
</head>
<body class="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50">

    <div class="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
        
        <!-- Header -->
        <div class="text-center mb-6">
            <div class="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
                <i data-lucide="check-circle" class="w-6 h-6"></i>
            </div>
            <h1 class="text-xl font-bold text-slate-900">Selamat Datang!</h1>
            <p class="text-slate-500 text-sm mt-1">Silakan lengkapi data diri Anda.</p>
        </div>

        <!-- Form -->
        <form action="#" method="POST" class="space-y-4">
            
            <!-- Nama -->
            <div>
                <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i data-lucide="user" class="h-5 w-5 text-slate-400"></i>
                    </div>
                    <input type="text" id="name" name="name" placeholder="Contoh: Ahmad Budiman" 
                        class="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
                        required>
                </div>
            </div>

            <!-- Umur -->
            <div>
                <label for="age" class="block text-sm font-medium text-slate-700 mb-1">Umur</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i data-lucide="cake" class="h-5 w-5 text-slate-400"></i>
                    </div>
                    <input type="number" id="age" name="age" placeholder="Contoh: 20" 
                        class="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow" 
                        required>
                </div>
            </div>

            <!-- Gender -->
            <div>
                <label for="gender" class="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i data-lucide="users" class="h-5 w-5 text-slate-400"></i>
                    </div>
                    <select id="gender" name="gender" 
                        class="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white transition-shadow" 
                        required>
                        <option value="" disabled selected>Pilih Jenis Kelamin</option>
                        <option value="male">Laki-laki</option>
                        <option value="female">Perempuan</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <i data-lucide="chevron-down" class="h-5 w-5 text-slate-400"></i>
                    </div>
                </div>
            </div>

            <!-- Tombol Simpan -->
            <div class="pt-4">
                <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                    Simpan & Lanjutkan
                </button>
            </div>

        </form>

    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>