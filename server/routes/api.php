<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\T_RespuestaController;
use App\Http\Controllers\T_TestController;
use App\Http\Controllers\U_userController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/* Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); */

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('/user', U_userController::class);
    Route::patch('/user/change-state/{id}', [U_userController::class, 'changeState']);

    Route::apiResource('/test', T_TestController::class);
    Route::get('/test/by/respuesta/{id}', [T_TestController::class, 'showByRespuesta']);
    Route::get('/test/mapi/answers', [T_TestController::class, 'getMapiAnswers']);


    Route::apiResource('/respuesta', T_RespuestaController::class);
    Route::get('/respuesta/for/resolve', [T_RespuestaController::class, 'indexForResolve']);
});
