<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'userId';
    public $incrementing = true;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username',
        'fullname',
        'password',
        'email',
        'created',
        'login',
        'status',
        'timezone',
        'languageId',
        'picture',
        'roleId',
        'date_format',
        'superadmin',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'created' => 'integer',
        'login' => 'integer',
        'superadmin' => 'boolean',
    ];

    /**
     * Get the role that owns the user.
     */
    public function role()
    {
        return $this->belongsTo(Role::class, 'roleId');
    }

    /**
     * Get the language that owns the user.
     */
    public function language()
    {
        return $this->belongsTo(Language::class, 'languageId');
    }

    /**
     * Get the pages (English) for the user.
     */
    public function pagesEn()
    {
        return $this->hasMany(PageEn::class, 'userId');
    }

    /**
     * Get the pages (Serbian) for the user.
     */
    public function pagesSr()
    {
        return $this->hasMany(PageSr::class, 'userId');
    }

    /**
     * Get the templates (English) for the user.
     */
    public function templatesEn()
    {
        return $this->hasMany(TemplateEn::class, 'userId');
    }

    /**
     * Get the templates (Serbian) for the user.
     */
    public function templatesSr()
    {
        return $this->hasMany(TemplateSr::class, 'userId');
    }
}