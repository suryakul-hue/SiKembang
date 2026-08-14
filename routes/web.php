<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\StuntingController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\EducationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\ReminderController;
use App\Http\Controllers\HemoglobinController;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Google Authentication
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleController::class, 'callback'])->name('auth.google.callback');

/*
|--------------------------------------------------------------------------
| Protected Routes (Login Required)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    
    // 1. Dashboard
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');
// 2. Setup Biodata Awal (Orang Tua & Anak)
    Route::get('/biodata-setup', function () {
        return Inertia::render('Auth/BiodataSetup'); 
    })->name('biodata.setup');

    Route::post('/biodata-setup', function (\Illuminate\Http\Request $request) {
        $request->validate([
            'gender'       => 'required|in:laki-laki,perempuan', // Gender Orang Tua
            'child_name'   => 'required|string|max:255',
            'child_dob'    => 'required|date',
            'child_gender' => 'required|in:L,P',
        ]);

        \DB::table('users')->where('id', Auth::id())->update([
            'gender'       => $request->gender,
            'child_name'   => $request->child_name,
            'child_dob'    => $request->child_dob,
            'child_gender' => $request->child_gender,
            'updated_at'   => now(),
        ]);

        return redirect()->route('dashboard');
    })->name('biodata.update');

    // Rute Stunting 
    Route::get('/stunting/check',               [StuntingController::class, 'index'])   ->name('stunting.check');
    Route::post('/stunting/store',              [StuntingController::class, 'store'])   ->name('stunting.store');
    Route::get('/stunting/riwayat',             [StuntingController::class, 'history']) ->name('stunting.history');
    Route::get('/stunting/{stuntingRecord}',    [StuntingController::class, 'show'])    ->name('stunting.show');
    Route::delete('/stunting/{stuntingRecord}', [StuntingController::class, 'destroy'])->name('stunting.destroy');

    // 4. Recipes - User Access
    Route::get('/recipes', [RecipeController::class, 'index'])->name('recipes.index');
    Route::get('/recipes/{recipe}', [RecipeController::class, 'show'])->name('recipes.show');

    // 5. Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 6. Reminder Widget Dashboard
    Route::post('/reminder/tablet-darah', [ReminderController::class, 'update'])->name('reminder.tablet-darah.update');
});

// Recipes - Admin Only
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('/recipes-admin', [RecipeController::class, 'adminIndex'])->name('recipes.admin');
    Route::get('/recipes/create', [RecipeController::class, 'create'])->name('recipes.create');
    Route::post('/recipes', [RecipeController::class, 'store'])->name('recipes.store');
    Route::get('/recipes/{recipe}/edit', [RecipeController::class, 'edit'])->name('recipes.edit');
    Route::put('/recipes/{recipe}', [RecipeController::class, 'update'])->name('recipes.update');
    Route::delete('/recipes/{recipe}', [RecipeController::class, 'destroy'])->name('recipes.destroy');
});

// Fitur Tambahan di luar grup
Route::get('/hemoglobin', [HemoglobinController::class, 'index'])->name('hemoglobin.index');
Route::get('/education', [EducationController::class, 'index'])->name('education.index'); // Aktifkan jika controllernya sudah ada

// Load rute bawaan Laravel Breeze
require __DIR__.'/auth.php';

// Load settings routes (Livewire-based settings pages)
require __DIR__.'/settings.php';
