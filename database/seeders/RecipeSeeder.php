<?php

namespace Database\Seeders;

use App\Models\Recipe;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        $recipes = [
            [
                'title' => 'Bubur Ayam Wortel (MPASI 6-8 bulan)',
                'description' => 'Bubur lembut dengan protein ayam dan vitamin A dari wortel, cocok untuk MPASI awal',
                'age_group' => '6-8',
                'ingredients' => "30 gram nasi\n30 gram daging ayam cincang\n20 gram wortel parut\n200 ml kaldu ayam\n1 sdt minyak kelapa",
                'instructions' => "Cuci bersih semua bahan\nRebus kaldu ayam hingga mendidih\nMasukkan nasi dan ayam, masak 10 menit\nTambahkan wortel, masak hingga lembut\nBlender/haluskan sesuai tekstur yang diinginkan\nTambahkan minyak kelapa sebelum disajikan",
                'cooking_time' => 20,
                'calories' => 120,
                'servings' => 1,
                'difficulty' => 'Mudah',
                'nutrition_tags' => ['Protein', 'Vitamin A', 'Zat Besi'],
                'tips' => 'Pastikan tekstur benar-benar lembut tanpa serat kasar. Bisa disaring jika perlu.',
            ],
            [
                'title' => 'Nasi Tim Ikan Salmon (9-11 bulan)',
                'description' => 'Nasi tim dengan ikan salmon kaya omega-3 untuk perkembangan otak',
                'age_group' => '9-11',
                'ingredients' => "50 gram nasi\n40 gram ikan salmon cincang\n20 gram tofu\n10 gram daun bawang\n1 siung bawang putih (haluskan)\n200 ml air kaldu",
                'instructions' => "Tumis bawang putih hingga harum\nMasukkan salmon, aduk hingga berubah warna\nTambahkan nasi dan kaldu\nMasukkan tofu yang sudah dihancurkan\nMasak hingga mengental dan matang\nTaburi daun bawang",
                'cooking_time' => 15,
                'calories' => 150,
                'servings' => 1,
                'difficulty' => 'Mudah',
                'nutrition_tags' => ['Omega-3', 'Protein', 'Kalsium'],
                'tips' => 'Pastikan ikan salmon fresh dan tidak berbau amis. Bisa ditambah jeruk nipis sedikit.',
            ],
        ];

        foreach ($recipes as $recipe) {
            Recipe::create($recipe);
        }
    }
}