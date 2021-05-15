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
Route::get('/ide21_creator/interface', 'App\Http\Controllers\LInterfaceController@index' );

//Route::get('/pages/{pageid}', 'App\Http\Controllers\LPagesController@index' ); // disable temporary, use ZF1 website

// Legacy Framework Routes
Route::any( "/{path?}", "App\Http\Controllers\LegacyController@index" )
    ->where( "path", ".*" );
