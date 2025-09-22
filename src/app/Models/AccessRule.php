<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessRule extends Model
{
    use HasFactory;

    protected $primaryKey = 'ruleId';
    public $incrementing = true;

    protected $fillable = [
        'roleId',
        'resource',
        'rule',
    ];

    /**
     * Get the role that owns the access rule.
     */
    public function role()
    {
        return $this->belongsTo(Role::class, 'roleId');
    }
}
