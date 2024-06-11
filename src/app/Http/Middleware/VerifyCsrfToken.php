<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        // exclude routes that are passed to Zend Framework, once the app is fully migrated to Laravel this should be removed
        'creator/*',
        'pages/*',
        'page/*',
        'view/*',
        'images/*',
        'menu/*',
        'category/*',
        'modules/*',
        'tables/*',
        'user/*',
        'search',
        'public/*'
    ];
}
