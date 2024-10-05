<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/a', function () {
    Artisan::call("migrate");
    return 1;
});

Route::get('/b', function () {
    Artisan::call("db:seed");
    return 1;
});

Route::get('/c', function () {
    Artisan::call("storage:link");
    return 1;
});