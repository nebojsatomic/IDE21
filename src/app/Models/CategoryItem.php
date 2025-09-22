<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'content_id',
        'category_id',
    ];

    /**
     * Get the category that owns the category item.
     */
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
