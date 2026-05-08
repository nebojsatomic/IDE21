<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Token extends Model
{
    use HasFactory;

    protected $primaryKey = 'requestId';
    public $incrementing = true;

    protected $fillable = [
        'username',
        'code',
        'used',
    ];
}