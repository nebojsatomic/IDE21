<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $primaryKey = 'item_id';
    public $incrementing = true;

    protected $fillable = [
        'parent_id',
        'menu_id',
        'content_id',
        'projectId',
        'enabled',
        'expanded',
        'weight',
        'check_access',
        'name_en',
        'description_en',
        'url_en',
        'name_sr',
        'description_sr',
        'url_sr',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'expanded' => 'boolean',
    ];

    /**
     * Get the menu that owns the menu item.
     */
    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menu_id');
    }

    /**
     * Get the project that owns the menu item.
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'projectId');
    }

    /**
     * Get the parent menu item.
     */
    public function parent()
    {
        return $this->belongsTo(MenuItem::class, 'parent_id');
    }

    /**
     * Get the child menu items.
     */
    public function children()
    {
        return $this->hasMany(MenuItem::class, 'parent_id');
    }
}
