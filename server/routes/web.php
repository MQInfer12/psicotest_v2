<?php

use App\Models\T_Carpeta;
use App\Models\T_Respuesta;
use App\Models\U_user;
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