<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'lastName',
        'depName',
        'address',
        'phone',
        'fax',
        'email',
        'weight',
    ];

    /**
     * Get the mod forms for the contact.
     */
    public function modForms()
    {
        return $this->hasMany(ModForm::class, 'contact');
    }
}
