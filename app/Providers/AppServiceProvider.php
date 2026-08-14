<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Livewire\Livewire;

use App\Http\Livewire\Pages\Settings\Profile as SettingsProfile;
use App\Http\Livewire\Pages\Settings\Password as SettingsPassword;
use App\Http\Livewire\Pages\Settings\Appearance as SettingsAppearance;
use App\Http\Livewire\Pages\Settings\DeleteUserForm as SettingsDeleteUserForm;
use App\Http\Livewire\Pages\Settings\TwoFactor as SettingsTwoFactor;
use App\Http\Livewire\Pages\Settings\TwoFactor\RecoveryCodes as SettingsTwoFactorRecoveryCodes;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        // Register Livewire component aliases used by routes and tests
        if (class_exists(Livewire::class)) {
            // Register both colon and dot notations to be safe for tests and views
            $components = [
                'pages::settings.profile' => SettingsProfile::class,
                'pages::settings.password' => SettingsPassword::class,
                'pages::settings.appearance' => SettingsAppearance::class,
                'pages::settings.delete-user-form' => SettingsDeleteUserForm::class,
                'pages::settings.two-factor' => SettingsTwoFactor::class,
                'pages::settings.two-factor.recovery-codes' => SettingsTwoFactorRecoveryCodes::class,
            ];

            foreach ($components as $alias => $class) {
                Livewire::component($alias, $class);

                // also register dot variant
                $dotAlias = str_replace('::', '.', $alias);
                Livewire::component($dotAlias, $class);

                // register without package prefix (e.g., settings.two-factor)
                $noPackage = preg_replace('/^[^:]+::/', '', $alias);
                Livewire::component($noPackage, $class);

                // register underscored variants
                $underscored = str_replace('-', '_', $noPackage);
                Livewire::component($underscored, $class);

                // register namespaced dot variant without package
                $dotNoPackage = str_replace('::', '.', $noPackage);
                Livewire::component($dotNoPackage, $class);
            }

            // Ensure Livewire knows our `pages` class namespace so
            // `pages::settings.two-factor` maps to App\Http\Livewire\Pages\Settings\TwoFactor
            try {
                app('livewire')->addNamespace(
                    'pages',
                    resource_path('views/pages'),
                    classNamespace: 'App\\Http\\Livewire\\Pages'
                );
            } catch (\Throwable $e) {
                // ignore if it fails during certain test bootstrap phases
            }
        }
    }
}
