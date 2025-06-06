<?php

use App\Http\Controllers\App_ConfiguracionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\B_BlogController;
use App\Http\Controllers\C_CasoController;
use App\Http\Controllers\C_CitaController;
use App\Http\Controllers\C_HorarioController;
use App\Http\Controllers\C_MotivoConsultaController;
use App\Http\Controllers\C_MotivoController;
use App\Http\Controllers\C_NotaController;
use App\Http\Controllers\C_OcupacionController;
use App\Http\Controllers\IA_PlantillaController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\T_CarpetaController;
use App\Http\Controllers\T_RespuestaController;
use App\Http\Controllers\T_TestController;
use App\Http\Controllers\T_TestVersionController;
use App\Http\Controllers\U_RolController;
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
Route::get('/blog', [B_BlogController::class, 'index']);
Route::get('/blog/{id}', [B_BlogController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/configuracion', [App_ConfiguracionController::class, 'showSettings']);
    Route::patch('/configuracion', [App_ConfiguracionController::class, 'patchSettings']);

    Route::apiResource('/user', U_userController::class);

    Route::get('/user', [U_userController::class, 'index']);
    Route::get('/user/for/search', [U_userController::class, 'indexSearch']);
    Route::get('/user/for/patients', [U_userController::class, 'indexForPatients']);
    Route::post('/user', [U_userController::class, 'store']);
    Route::get('/user/{email}/psicotest/profile', [U_userController::class, 'showProfile']);
    Route::get('/user/{email}/psicotest', [U_userController::class, 'show']);
    Route::put('/user/{email}/psicotest', [U_userController::class, 'update']);
    Route::delete('/user/{email}/psicotest', [U_userController::class, 'destroy']);
    Route::patch('/user/change-state/{email}/psicotest', [U_userController::class, 'changeState']);
    Route::patch('/user/change-rol/{email}/psicotest', [U_userController::class, 'changeRol']);
    Route::patch('/user/change-disponibility/{email}/psicotest', [U_userController::class, 'disponibilityToggle']);

    Route::apiResource('/test', T_TestController::class);
    Route::get('/test/by/respuesta/{id}', [T_TestController::class, 'showByRespuesta']);
    Route::get('/test/for/respuesta/{id}', [T_TestController::class, 'showForRespuesta']);
    Route::get('/test/for/respuesta', [T_TestController::class, 'indexForRespuesta']);
    Route::put('/test/update/db', [T_TestController::class, 'updateDb']);

    Route::get('/version/test/{id}', [T_TestVersionController::class, 'showByTest']);

    Route::apiResource('/respuesta', T_RespuestaController::class);
    Route::get('/respuesta/for/resolve', [T_RespuestaController::class, 'indexForResolve']);
    Route::get('/respuesta/for/table', [T_RespuestaController::class, 'indexForTable']);
    Route::patch('/respuesta/patch/interpretation/{id}', [T_RespuestaController::class, 'patchInterpretation']);
    Route::patch('/respuesta/patch/interpretations', [T_RespuestaController::class, 'patchInterpretations']);
    Route::patch('/respuesta/patch/visibilidad', [T_RespuestaController::class, 'patchVisibilidad']);
    Route::put('/respuesta/delete/many', [T_RespuestaController::class, 'destroyMany']);
    Route::put('/respuesta/move/many', [T_RespuestaController::class, 'moveMany']);

    Route::apiResource('/rol', U_RolController::class);

    Route::apiResource('/carpeta', T_CarpetaController::class);

    Route::apiResource('/plantilla', IA_PlantillaController::class);

    Route::apiResource('/horario', C_HorarioController::class);
    Route::get('/horario/for/me', [C_HorarioController::class, 'indexForMe']);
    Route::get('/horario/for/reprogramming', [C_HorarioController::class, 'indexForReprogramming']);

    Route::apiResource('/motivo-consulta', C_MotivoConsultaController::class);

    Route::apiResource('/cita', C_CitaController::class);
    Route::patch('/cita/cerrar/{id}', [C_CitaController::class, 'closeClinically']);
    Route::get('/cita/paciente/{email}/psicotest', [C_CitaController::class, 'showByPatient']);
    Route::get('/cita/historial/{email}/psicotest', [C_CitaController::class, 'showHistory']);
    Route::get('/cita/respuesta/status/{id_calendar}', [C_CitaController::class, 'respuestaStatus']);
    Route::patch('/cita/respuesta/{id}', [C_CitaController::class, 'respuesta']);
    Route::put('/cita/destroy/{id}', [C_CitaController::class, 'destroyWithToken']);

    Route::patch('/caso/cerrar/cita/{id_cita}', [C_CasoController::class, 'cerrarEIniciarNuevoDesdeCita']);
    Route::patch('/caso/cerrar/{id}', [C_CasoController::class, 'cerrarCaso']);
    Route::patch('/caso/cambiar-nombre/{id}', [C_CasoController::class, 'cambiarNombre']);

    Route::apiResource('/nota', C_NotaController::class);

    Route::apiResource('/ocupacion', C_OcupacionController::class);

    Route::get('/motivo/for/canceladas', [C_MotivoController::class, 'indexForCanceladas']);
    Route::patch('/cita/reprogramacion/{id}', [C_MotivoController::class, 'reprogramacion']);
    Route::patch('/cita/cancelacion/{id}', [C_MotivoController::class, 'cancelacion']);

    Route::post('/blog', [B_BlogController::class, 'store']);
    Route::put('/blog/{id}', [B_BlogController::class, 'update']);
    Route::delete('/blog/{id}', [B_BlogController::class, 'destroy']);
    Route::get('/blog/for/me', [B_BlogController::class, 'indexForMe']);
    Route::patch('/blog/standout/{id}', [B_BlogController::class, 'standOut']);
    Route::patch('/blog/attend/{id}', [B_BlogController::class, 'attendToggle']);

    Route::get('/reportes/totales', [ReportsController::class, 'totals']);
});
