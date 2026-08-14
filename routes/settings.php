<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Livewire\Pages\Settings\Profile as SettingsProfile;
use App\Http\Livewire\Pages\Settings\Password as SettingsPassword;
use App\Http\Livewire\Pages\Settings\Appearance as SettingsAppearance;
use App\Http\Livewire\Pages\Settings\TwoFactor as SettingsTwoFactor;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::livewire('settings/profile', SettingsProfile::class)->name('profile.edit');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::livewire('settings/password', SettingsPassword::class)->name('user-password.edit');
    Route::livewire('settings/appearance', SettingsAppearance::class)->name('appearance.edit');

    // Use Livewire alias to ensure page component name is resolvable during routing
    Route::livewire('settings/two-factor', 'pages::settings.two-factor')
        ->middleware(
            when(
                Features::canManageTwoFactorAuthentication()
                && Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword'),
                ['password.confirm'],
                [],
            ),
        )
        ->name('two-factor.show');
});
