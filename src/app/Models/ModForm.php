<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'projectId',
        'templateId',
        'name',
        'message',
        'contact',
        'weight',
    ];

    /**
     * Get the project that owns the mod form.
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'projectId');
    }

    /**
     * Get the contact for the mod form.
     */
    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact');
    }

    /**
     * Get the mod form fields for the mod form.
     */
    public function modFormFields()
    {
        return $this->hasMany(ModFormField::class, 'form_id');
    }
}
