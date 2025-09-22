<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Email extends Model
{
    use HasFactory;

    protected $primaryKey = 'emailId';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'emailId',
        'subject',
        'body',
        'description',
    ];
}
