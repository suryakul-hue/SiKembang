<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class Admin
{
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah user sudah login DAN apakah dia Admin (menggunakan fungsi isAdmin() dari model User)
        if (!Auth::check() || !Auth::user()->isAdmin()) {
            // Jika bukan admin, lempar kembali ke dashboard biasa
            return redirect('/dashboard');
        }

        return $next($request);
    }
}