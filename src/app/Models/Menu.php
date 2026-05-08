<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $primaryKey = 'menu_id';
    public $incrementing = true;

    protected $fillable = [
        'projectId',
        'name',
        'description',
        'check_access',
        'block_id',
    ];

    /**
     * Get the project that owns the menu.
     */
    public function project()
    {
        return $this->belongsTo(Project::class, 'projectId');
    }

    /**
     * Get the menu items for the menu.
     */
    public function menuItems()
    {
        return $this->hasMany(MenuItem::class, 'menu_id');
    }
}
