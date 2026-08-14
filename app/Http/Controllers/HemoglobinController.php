<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class HemoglobinController extends Controller
{
    public function index()
    {
        return Inertia::render('Hemoglobin/Index');
        // File ini nanti ada di resources/js/Pages/Hemoglobin/Index.jsx
    }
}