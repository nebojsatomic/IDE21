<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentsRating extends Model
{
    use HasFactory;

    protected $table = 'comments_ratings';

    protected $fillable = [
        'commentatorName',
        'commentatorIp',
        'rating',
        'time',
        'pageId',
    ];

    protected $casts = [
        'time' => 'datetime',
    ];

    /**
     * Get the page that owns the comment rating.
     */
    public function page()
    {
        return $this->belongsTo(PageEn::class, 'pageId');
    }

    /**
     * Get the page (Serbian) that owns the comment rating.
     */
    public function pageSr()
    {
        return $this->belongsTo(PageSr::class, 'pageId');
    }
}
