<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'enabled',
        'isDefault',
        'weight',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'isDefault' => 'boolean',
    ];

    /**
     * Get the users for the language.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'languageId');
    }
}
