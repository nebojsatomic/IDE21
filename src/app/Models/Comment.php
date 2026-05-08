<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'pageId',
        'contentType',
        'moduleName',
        'commentatorName',
        'commentatorEmail',
        'comment',
        'status',
        'replyToComment',
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    /**
     * Get the page that owns the comment.
     */
    public function page()
    {
        return $this->belongsTo(PageEn::class, 'pageId');
    }

    /**
     * Get the page (Serbian) that owns the comment.
     */
    public function pageSr()
    {
        return $this->belongsTo(PageSr::class, 'pageId');
    }

    /**
     * Get the parent comment.
     */
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'replyToComment');
    }

    /**
     * Get the child comments.
     */
    public function replies()
    {
        return $this->hasMany(Comment::class, 'replyToComment');
    }
}
