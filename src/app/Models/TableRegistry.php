<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TableRegistry extends Model
{
    use HasFactory;

    protected $table = 'tableregistry';

    protected $fillable = [
        'tablePK',
        'name',
        'core',
    ];

    protected $casts = [
        'core' => 'boolean',
    ];
}