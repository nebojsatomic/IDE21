<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $primaryKey = 'moduleId';
    public $incrementing = true;

    protected $fillable = [
        'templateId',
        'projectId',
        'moduleName',
        'moduleDesc',
        'version',
        'enabled',
        'core',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'core' => 'boolean',
    ];

    /**
     * Get the project that owns the module.
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'projectId');
    }
}
