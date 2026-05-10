<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\DataProvider;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class LegacyRoutesTest extends TestCase
{
    protected static $cookies = null;

    /**
     * Helper to get authenticated cookies once per test run.
     */
    protected function getAuthenticatedCookies()
    {
        if (self::$cookies === null) {
            // Try both URLs and both submit button names
            $loginUrls = ['https://localhost/adm', 'https://localhost/adm/login'];
            
            foreach ($loginUrls as $url) {
                $response = Http::asForm()
                    ->withoutVerifying()
                    ->post($url, [
                        'username' => 'proba',
                        'password' => 'proba',
                        'creatorLang' => 'en',
                        'submit' => 'Login',
                        'loginsubmit' => 'Login'
                    ]);

                // If it redirects (302) or returns the dashboard (200 with specific text), it's a success
                if ($response->status() === 302 || ($response->status() === 200 && str_contains($response->body(), 'IDE21 - Ver.'))) {
                    $cookieArray = [];
                    foreach ($response->cookies() as $cookie) {
                        $cookieArray[$cookie->getName()] = $cookie->getValue();
                    }
                    self::$cookies = $cookieArray;
                    return self::$cookies;
                }
            }

            throw new \Exception("Legacy login failed. Status: " . $response->status() . ". Body snippet: " . substr($response->body(), 0, 500));
        }

        return self::$cookies;
    }

    #[DataProvider('legacyRoutesProvider')]
    public function test_legacy_route_returns_200($method, $url): void
    {
        $cookies = $this->getAuthenticatedCookies();
        $fullUrl = 'https://localhost' . $url;
        
        $response = Http::withoutVerifying()
            ->withCookies($cookies, 'localhost')
            ->send($method, $fullUrl);

        // We accept 200 (Success) or 302 (Redirect)
        $this->assertTrue(
            in_array($response->status(), [200, 302]),
            "Route {$fullUrl} [{$method}] failed with status " . $response->status() . "\nBody snippet: " . substr($response->body(), 0, 200)
        );
    }

    public static function legacyRoutesProvider(): array
    {
        /*
        $routes = [
            'category/add-category', 'category/add-category-item', 'category/del-category', 'category/del-category-item',
            'category/index', 'category/rename-cat', 'category/show-category-items', 'comments/admin',
            'comments/delete-comment', 'comments/index', 'comments/rate', 'contact/index',
            'creator/add-language', 'creator/add-new-daisy', 'creator/backup-site', 'creator/build-search-index',
            'creator/change-language', 'creator/change-pagination-step', 'creator/clean-cache', 'creator/corner-params',
            'creator/delete-language', 'creator/delete-setting', 'creator/generate-cache', 'creator/index',
            'creator/login', 'creator/logout', 'creator/manage-all-pages', 'creator/paginate-table',
            'creator/paginate-table-manage-pages', 'creator/save-daisy-themes', 'creator/set-bound', 'creator/set-check-access',
            'creator/set-permissions', 'creator/shadow-params', 'creator/table', 'css/index', 'error/error', 'error/index',
            'exportsite/export-pages', 'exportsite/index', 'forms/admin', 'forms/index', 'forms/process-form',
            'forms/process-form-fields', 'forms/show-form-fields', 'forms/submited', 'help/admin', 'help/index',
            'images/add-folder', 'images/delete-folder', 'images/delete-image', 'images/index', 'images/show-image-details',
            'images/show-images', 'images/upload', 'index/index', 'jquery/index', 'menu/add-menu', 'menu/add-menu-item',
            'menu/change-weight', 'menu/delete-menu-item', 'menu/del-menu', 'menu/edit-menu-item', 'menu/get-pages-by-category',
            'menu/index', 'menu/pure-json', 'menu/show-menu', 'menu/show-menu-items', 'modules/del-module',
            'modules/edit-module', 'modules/enable-all-modules', 'modules/index', 'modules/install-module',
            'page/apply-template', 'page/change-template', 'page/choose-page', 'page/choose-template', 'page/delete-page',
            'page/delete-pages-selected', 'page/delete-template', 'page/export-selected-site', 'page/export-template',
            'page/get-permision-form', 'page/index', 'page/install-template', 'page/install-template-db', 'page/open',
            'page/save', 'page/save-as-template', 'page/set-homepage', 'page/set-permissions', 'page/toggle-check-access',
            'page/toggle-published', 'page/toggle-published-selected', 'page/toggle-restrict-selected', 'page/update',
            'page/update-template', 'save/index', 'search/admin', 'search/index', 'sitemap/admin', 'sitemap/index',
            'tables/add-row', 'tables/delete-row', 'tables/edit-row', 'tables/index', 'tables/xmltables',
            'user/account-activation', 'user/admin', 'user/admin-add-user', 'user/change-password', 'user/index',
            'user/login', 'user/logout', 'user/my-account', 'user/password-reminder', 'user/register',
            'view/bind-view-css', 'view/bind-view-js', 'view/change-language', 'view/index', 'view/render-tv'
        ];
        */

        $routes = [
            'pages/43', 'page/choose-page/43', 'adm/', 'creator/save-daisy-themes', 'creator/add-language/ba', 'creator/manage-all-pages', 'user/logout'
        ];

        $data = [];
        foreach ($routes as $route) {
            [$controller, $action] = explode('/', $route);

            // Determine Method
            $method = 'GET';
            $postPatterns = ['add', 'del', 'save', 'update', 'process', 'login', 'logout', 'rate', 'toggle', 'backup', 'clean'];
            foreach ($postPatterns as $pattern) {
                if (stripos($action, $pattern) !== false) {
                    $method = 'POST';
                    break;
                }
            }

            // Map Controller/Action to URL
            $url = '';
            if ($controller === 'creator') {
                $url = '/adm';
                if ($action !== 'index') {
                    $url .= '/' . $action;
                }
            } else {
                $url = '/' . $controller;
                if ($action !== 'index') {
                    $url .= '/' . $action;
                }
            }

            $data[$route] = [$method, $url];
        }

        return $data;
    }
}
