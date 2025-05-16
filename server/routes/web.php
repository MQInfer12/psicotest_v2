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

Route::get('/link', function () {
    abort_unless(request('token') === env('WEB_ENDPOINTS_SECRET'), 403);
    Artisan::call("storage:link");
    $output = Artisan::output();
    return response($output, 200)->header('Content-Type', 'text/plain');
});

Route::get('/migrate', function () {
    abort_unless(request('token') === env('WEB_ENDPOINTS_SECRET'), 403);
    Artisan::call("migrate", ['--force' => true]);
    $output = Artisan::output();
    return response($output, 200)->header('Content-Type', 'text/plain');
});

Route::get('/seed', function () {
    abort_unless(request('token') === env('WEB_ENDPOINTS_SECRET'), 403);
    Artisan::call("db:seed", ['--force' => true]);
    $output = Artisan::output();
    return response($output, 200)->header('Content-Type', 'text/plain');
});

Route::get('/backup', function () {
    abort_unless(request('token') === env('WEB_ENDPOINTS_SECRET'), 403);
    Artisan::call("db:backup");
    $output = Artisan::output();
    return response($output, 200)->header('Content-Type', 'text/plain');
});

Route::get('/restore', function () {
    abort_unless(request('token') === env('WEB_ENDPOINTS_SECRET'), 403);
    $success = Artisan::call("db:restore");
    return $success ? "Database restored successfully" : "Database restore failed";
});

Route::get('/foo', function () {
    return encrypt("671cad6342829703451172bc8ef2c46e780277081404b664236ed4e9ba5edb7b");
});
