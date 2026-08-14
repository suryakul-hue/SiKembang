<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Livewire\Livewire;

use App\Http\Livewire\Pages\Settings\Profile as SettingsProfile;
use App\Http\Livewire\Pages\Settings\Password as SettingsPassword;
use App\Http\Livewire\Pages\Settings\Appearance as SettingsAppearance;
use App\Http\Livewire\Pages\Settings\DeleteUserForm as SettingsDeleteUserForm;
use App\Http\Livewire\Pages\Settings\TwoFactor as SettingsTwoFactor;
use App\Http\Livewire\Pages\Settings\TwoFactor\RecoveryCodes as SettingsTwoFactorRecoveryCodes;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (class_exists(Livewire::class)) {
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
                Livewire::component(str_replace('::', '.', $alias), $class);
                Livewire::component(preg_replace('/^[^:]+::/', '', $alias), $class);
                Livewire::component(str_replace('-', '_', preg_replace('/^[^:]+::/', '', $alias)), $class);
            }
        }
    }
}
