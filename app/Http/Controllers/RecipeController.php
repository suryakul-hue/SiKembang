<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecipeController extends Controller
{
    // =================================================================
    // 1. BAGIAN UNTUK USER BIASA
    // =================================================================

    public function index()
    {
        // Lempar ke file 'Recipes.jsx' (sesuai nama file di folder Pages-mu)
        return Inertia::render('Recipes/Index', [
            'recipes' => Recipe::latest()->get()
        ]);
    }

    public function show(Recipe $recipe)
    {
        return response()->json($recipe);
    }

    // =================================================================
    // 2. BAGIAN UNTUK ADMIN (Bisa CRUD Data Resep)
    // =================================================================

    public function adminIndex()
    {
        // Lempar ke halaman React 'AdminRecipes.jsx' yang akan kita buat nanti
        return Inertia::render('Admin', [
            'recipes' => Recipe::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'age_group'      => 'required|string|max:255',
            'category'       => 'nullable|string|max:255',
            'cooking_time'   => 'required|integer',
            'calories'       => 'required|integer',
            'difficulty'     => 'required|string',
            'benefits'       => 'nullable|string',
            'emoji'          => 'nullable|string',
            'nutrition_tags' => 'nullable|array',
            'ingredients'    => 'nullable|array',
            'instructions'   => 'nullable|array',
        ]);

        Recipe::create($validated);
        return redirect()->back()->with('success', 'Resep berhasil ditambahkan!');
    }

    public function update(Request $request, Recipe $recipe)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'age_group'      => 'required|string|max:255',
            'category'       => 'nullable|string|max:255',
            'cooking_time'   => 'required|integer',
            'calories'       => 'required|integer',
            'difficulty'     => 'required|string',
            'benefits'       => 'nullable|string',
            'emoji'          => 'nullable|string',
            'nutrition_tags' => 'nullable|array',
            'ingredients'    => 'nullable|array',
            'instructions'   => 'nullable|array',
        ]);

        $recipe->update($validated);
        return redirect()->back()->with('success', 'Resep berhasil diperbarui!');
    }

    public function destroy(Recipe $recipe)
    {
        $recipe->delete();
        return redirect()->back()->with('success', 'Resep berhasil dihapus!');
    }

    // Method kosong ini ditambahkan agar routing web.php kamu tidak error
    public function create() { return back(); }
    public function edit(Recipe $recipe) { return back(); }
}