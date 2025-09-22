<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'permissions',
        'description',
    ];

    /**
     * Get the categories for the project.
     */
    public function categories()
    {
        return $this->hasMany(Category::class, 'projectId');
    }

    /**
     * Get the menus for the project.
     */
    public function menus()
    {
        return $this->hasMany(Menu::class, 'projectId');
    }

    /**
     * Get the mod forms for the project.
     */
    public function modForms()
    {
        return $this->hasMany(ModForm::class, 'projectId');
    }

    /**
     * Get the modules for the project.
     */
    public function modules()
    {
        return $this->hasMany(Module::class, 'projectId');
    }

    /**
     * Get the pages (English) for the project.
     */
    public function pagesEn()
    {
        return $this->hasMany(PageEn::class, 'projectId');
    }

    /**
     * Get the pages (Serbian) for the project.
     */
    public function pagesSr()
    {
        return $this->hasMany(PageSr::class, 'projectId');
    }

    /**
     * Get the templates (English) for the project.
     */
    public function templatesEn()
    {
        return $this->hasMany(TemplateEn::class, 'projectId');
    }

    /**
     * Get the templates (Serbian) for the project.
     */
    public function templatesSr()
    {
        return $this->hasMany(TemplateSr::class, 'projectId');
    }
}
