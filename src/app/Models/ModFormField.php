<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModFormField extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_id',
        'name',
        'type',
        'enabled',
        'weight',
    ];

    protected $casts = [
        'enabled' => 'boolean',
    ];

    /**
     * Get the mod form that owns the mod form field.
     */
    public function modForm()
    {
        return $this->belongsTo(ModForm::class, 'form_id');
    }
}
