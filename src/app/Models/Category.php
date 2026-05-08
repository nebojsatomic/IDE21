<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $primaryKey = 'category_id';
    public $incrementing = true;

    protected $fillable = [
        'projectId',
        'name',
        'type',
        'permissions',
        'description',
        'name_en',
        'name_sr',
    ];

    /**
     * Get the project that owns the category.
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'projectId');
    }

    /**
     * Get the category items for the category.
     */
    public function categoryItems()
    {
        return $this->hasMany(CategoryItem::class, 'category_id');
    }
}
