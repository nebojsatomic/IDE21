<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $primaryKey = 'roleId';
    public $incrementing = true;

    protected $fillable = [
        'name',
        'core',
    ];

    protected $casts = [
        'core' => 'boolean',
    ];

    /**
     * Get the users for the role.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'roleId');
    }

    /**
     * Get the access rules for the role.
     */
    public function accessRules()
    {
        return $this->hasMany(AccessRule::class, 'roleId');
    }
}
