<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Tests\TestCase;

class GoogleLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_google_user_is_redirected_to_biodata_setup(): void
    {
        $provider = new class {
            public function user()
            {
                return new class {
                    public function getEmail(): string
                    {
                        return 'new.user@example.com';
                    }

                    public function getName(): string
                    {
                        return 'New User';
                    }

                    public function getId(): string
                    {
                        return 'google-new-user';
                    }

                    public function getAvatar(): string
                    {
                        return 'https://example.com/avatar.png';
                    }
                };
            }
        };

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('biodata.setup'));
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', ['email' => 'new.user@example.com']);
    }

    public function test_existing_google_user_is_redirected_to_dashboard(): void
    {
        $existingUser = User::factory()->create([
            'email' => 'existing.user@example.com',
            'google_id' => 'existing-google-id',
        ]);

        $provider = new class {
            public function user()
            {
                return new class {
                    public function getEmail(): string
                    {
                        return 'existing.user@example.com';
                    }

                    public function getName(): string
                    {
                        return 'Existing User';
                    }

                    public function getId(): string
                    {
                        return 'existing-google-id';
                    }

                    public function getAvatar(): string
                    {
                        return 'https://example.com/avatar.png';
                    }
                };
            }
        };

        Socialite::shouldReceive('driver')->with('google')->andReturn($provider);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($existingUser);
    }
}
