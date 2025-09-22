<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageSr extends Model
{
    use HasFactory;

    protected $table = 'pages_sr';

    protected $fillable = [
        'projectId',
        'userId',
        'dateChanged',
        'title',
        'alias',
        'objectids',
        'description',
        'keywords',
        'category',
        'template_id',
        'image',
        'output',
        'published',
        'homepage',
        'css',
        'js',
        'check_access',
        'bounded',
        'unbounded',
    ];

    protected $casts = [
        'published' => 'boolean',
        'homepage' => 'boolean',
        'bounded' => 'boolean',
        'unbounded' => 'boolean',
    ];

    /**
     * Get the project that owns the page.
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'projectId');
    }

    /**
     * Get the user that owns the page.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    /**
     * Get the comments for the page.
     */
    public function comments()
    {
        return $this->hasMany(Comment::class, 'pageId');
    }

    /**
     * Get the comments ratings for the page.
     */
    public function commentsRatings()
    {
        return $this->hasMany(CommentsRating::class, 'pageId');
    }
}
