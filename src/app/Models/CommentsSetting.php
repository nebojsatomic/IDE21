<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentsSetting extends Model
{
    use HasFactory;

    protected $table = 'comments_settings';

    protected $fillable = [
        'contentType',
        'status',
        'access',
        'postType',
    ];

    protected $casts = [
        'status' => 'boolean',
        'access' => 'boolean',
    ];
}
