<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateSr extends Model
{
    use HasFactory;

    protected $table = 'templates_sr';

    protected $fillable = [
        'projectId',
        'userId',
        'dateChanged',
        'title',
        'alias',
        'objectids',
        'description',
        'category',
        'image',
        'output',
        'defaultTemplate',
        'bodyBg',
        'staticFiles',
    ];

    protected $casts = [
        'defaultTemplate' => 'boolean',
    ];

    /**
     * Get the project that owns the template.
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'projectId');
    }

    /**
     * Get the user that owns the template.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }
}