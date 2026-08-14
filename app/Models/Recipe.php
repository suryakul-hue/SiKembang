<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'age_group',
        'category',
        'cooking_time',
        'calories',
        'difficulty',
        'benefits',
        'emoji',
        'image',
        'rating',
        'reviews',
        'nutrition_tags',
        'ingredients',
        'instructions',
    ];

    // Ini PENTING: Agar array dari React otomatis jadi JSON di database, dan sebaliknya.
    protected function casts(): array
    {
        return [
            'nutrition_tags' => 'array',
            'ingredients'    => 'array',
            'instructions'   => 'array',
            'rating'         => 'float',
            'cooking_time'   => 'integer',
            'calories'       => 'integer',
        ];
    }
}