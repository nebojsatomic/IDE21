<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'settingName',
        'description',
        'value',
        'core',
    ];

    protected $casts = [
        'core' => 'boolean',
    ];
}
