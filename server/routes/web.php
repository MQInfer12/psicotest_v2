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

Route::get('/reset', function () {
    Artisan::call("migrate:refresh --seed");
    return 1;
});

Route::get('/link', function () {
    Artisan::call("storage:link");
    return 1;
});

Route::get('/backup', function () {
    Artisan::call("db:backup");
    return 1;
});

Route::get('/restore', function () {
    $success = Artisan::call("db:restore");
    return $success ? "Database restored successfully" : "Database restore failed";
});
