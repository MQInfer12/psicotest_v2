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
    return 1;
});

Route::get('/migrate', function () {
    abort_unless(request('token') === env('WEB_ENDPOINTS_SECRET'), 403);
    Artisan::call("migrate");
    return 1;
});

Route::get('/seed', function () {
    abort_unless(request('token') === env('WEB_ENDPOINTS_SECRET'), 403);
    Artisan::call("db:seed");
    return 1;
});

Route::get('/backup', function () {
    abort_unless(request('token') === env('WEB_ENDPOINTS_SECRET'), 403);
    Artisan::call("db:backup");
    return 1;
});

Route::get('/restore', function () {
    abort_unless(request('token') === env('WEB_ENDPOINTS_SECRET'), 403);
    $success = Artisan::call("db:restore");
    return $success ? "Database restored successfully" : "Database restore failed";
});
