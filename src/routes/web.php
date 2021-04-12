<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
/*
Route::get('/', function () {
    return view('welcome');
});

Route::get('/aa', function () {
    return 'Hello World';
});
*/
#Route::get('/creator', [LegacyController::class, 'index'])

// Legacy Framework Routes
Route::any( "/{path?}", "App\Http\Controllers\LegacyController@index" )
    ->where( "path", ".*" );
