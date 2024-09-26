<?php

namespace App\Http\Controllers;

use App\Http\Requests\T_RespuestaStoreRequest;
use App\Http\Requests\T_RespuestaUpdateRequest;
use App\Http\Resources\T_Tests_RepuestaResource;
use App\Models\T_Respuesta;
use App\Models\T_Test;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class T_RespuestaController extends Controller
{
    use ApiResponse;

    public function index()
    {
        //? AL VER LA TABLA DE RESULTADOS
    }

    public function indexForResolve(Request $request)
    {
        $user = $request->user();
        return $this->successResponse(
            "Tests obtenidos correctamente.",
            T_Tests_RepuestaResource::collection($user->respuestas)
        );
    }
    
    public function indexForTable(Request $request)
    {
        $user = $request->user();
        return $this->successResponse(
            "Tests obtenidos correctamente.",
            T_Tests_RepuestaResource::collection($user->asignados)
        );
    }

    public function store(T_RespuestaStoreRequest $request)
    {
        //? AL INGRESAR AL LINK DEL QR
        $validatedData = $request->validated();

        $test = T_Test::findOrFail($validatedData['id_test']);
        $user = $request->user();

        $id_test_version = $test->latest_version->id;
        $email_user = $user->email;
        $email_asignador = $validatedData['email_asignador'];

        if ($email_user == $email_asignador) {
            return $this->wrongResponse('No te puedes asignar un test a ti mismo.');
        }

        $exist = T_Respuesta::where('id_test_version', $id_test_version)
            ->where('email_user', $email_user)
            ->where('email_asignador', $email_asignador)
            ->first();
        if ($exist) {
            return $this->successResponse(
                'Ya se te asignó este test.',
                $exist->id
            );
        }

        $respuesta = T_Respuesta::create([
            "id_test_version" => $id_test_version,
            "email_user" => $email_user,
            "email_asignador" => $email_asignador,
            "estado" => "Pendiente",
            "fecha_asignado" => now()
        ]);

        return $this->successResponse(
            "Test asignado correctamente.",
            $respuesta->id
        );
    }

    public function show(T_Respuesta $t_Respuesta)
    {
        //? PARA CARGAR EL TEST
    }

    public function update(T_RespuestaUpdateRequest $request, int $id)
    {
        //? AL MOMENTO DE ENVIAR EL TEST
        $validatedData = $request->validated();

        $respuesta = T_Respuesta::findOrFail($id);

        $respuesta->update([
            "resultados" => $validatedData['resultados'],
            "estado" => "Enviado",
            "fecha_enviado" => now()
        ]);

        return $this->successResponse(
            "Test enviado correctamente.",
            new T_Tests_RepuestaResource($respuesta)
        );
    }
}
