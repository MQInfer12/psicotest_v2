<?php

namespace App\Http\Controllers;

use App\Http\Requests\T_RespuestaIndexForTableRequest;
use App\Http\Requests\T_RespuestaPatchInterpretationRequest;
use App\Http\Requests\T_RespuestaStoreRequest;
use App\Http\Requests\T_RespuestaUpdateRequest;
use App\Http\Resources\T_Test_RespuestaResource;
use App\Http\Resources\T_Tests_RepuestaResource;
use App\Models\T_Respuesta;
use App\Models\T_Test;
use App\Models\U_user;
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

    public function indexForTable(T_RespuestaIndexForTableRequest $request)
    {
        $user = $request->user();
        $folders = $request->input('folders', []);
        if (empty($folders)) {
            return $this->successResponse("Tests obtenidos correctamente.", []);
        }

        $respuestas = T_Respuesta::where('email_asignador', $user->email)
            ->when(in_array(0, $folders), function ($query) use ($folders) {
                return $query->where(function ($query) use ($folders) {
                    $query->whereIn('id_carpeta', array_diff($folders, [0]))
                        ->orWhereNull('id_carpeta');
                });
            }, function ($query) use ($folders) {
                return $query->whereIn('id_carpeta', $folders);
            })
            ->get();

        return $this->successResponse(
            "Tests obtenidos correctamente.",
            T_Tests_RepuestaResource::collection($respuestas)
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

        $asignador = U_user::findOrFail($email_asignador);
        if (!in_array('Compartir test', $asignador->rol->permisos->pluck('descripcion')->toArray())) {
            return $this->wrongResponse('Esta persona no tiene permisos para compartir tests.');
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

    public function patchInterpretation(T_RespuestaPatchInterpretationRequest $request, int $id)
    {
        $validatedData = $request->validated();
        $respuesta = T_Respuesta::findOrFail($id);
        $respuesta->update([
            "interpretacion" => $validatedData['interpretacion'],
        ]);
        return $this->successResponse(
            "Interpretación guardada correctamente.",
            new T_Test_RespuestaResource($respuesta)
        );
    }
}
