<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeekReminder extends Model
{
    // Tegaskan nama tabelnya di sini
    protected $table = 'week_reminders';

    protected $fillable = [
        'user_id', 
        'week_number', 
        'year', 
        'taken_this_week', 
        'date_taken'
    ];
}