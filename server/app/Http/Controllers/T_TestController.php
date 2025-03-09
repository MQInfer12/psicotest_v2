<?php

namespace App\Http\Controllers;

use App\Http\Requests\T_TestIndexForRespuestaRequest;
use App\Http\Requests\T_TestUpdateDbRequest;
use App\Http\Resources\T_Test_RespuestaResource;
use App\Http\Resources\T_TestResource;
use App\Http\Resources\T_TestsResource;
use App\Models\T_Carpeta;
use App\Models\T_Respuesta;
use App\Models\T_Test;
use App\Models\T_TestVersion;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class T_TestController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $tests = T_Test::all();
        return $this->successResponse(
            "Tests obtenidos correctamente.",
            T_TestsResource::collection($tests)
        );
    }

    public function indexForRespuesta(T_TestIndexForRespuestaRequest $request)
    {
        $user = $request->user();
        $ids = $request->input('ids', []);

        $respuestas = T_Respuesta::whereIn('id', $ids)->get();

        $carpetas = $user->carpetas->pluck('id')->toArray();
        $compartidas = $user->carpetasCompartidas->pluck('id')->toArray();
        $globales = T_Carpeta::where('global', true)->pluck('id')->toArray();

        if ($respuestas->contains(
            fn($respuesta) =>
            $respuesta->email_asignador !== $user->email &&
                !in_array($respuesta->id_carpeta, $carpetas) &&
                !in_array($respuesta->id_carpeta, $compartidas) &&
                !in_array($respuesta->id_carpeta, $globales)
        )) {
            return $this->wrongResponse('No tienes permisos para acceder a algún recurso');
        }

        return $this->successResponse(
            "Respuestas obtenidas correctamente.",
            T_Test_RespuestaResource::collection($respuestas)
        );
    }

    public function show($id)
    {
        $test = T_Test::findOrFail($id);
        return $this->successResponse(
            "Test obtenido correctamente.",
            new T_TestResource($test)
        );
    }

    public function showByRespuesta(Request  $request, $id)
    {
        $user = $request->user();
        $respuesta = T_Respuesta::findOrFail($id);

        if ($user->email != $respuesta->email_user) {
            return $this->wrongResponse('No tienes permisos para acceder a este recurso');
        }
        return $this->successResponse(
            "Test obtenido correctamente.",
            new T_Test_RespuestaResource($respuesta)
        );
    }

    public function showForRespuesta(Request $request, $id)
    {
        $user = $request->user();
        $respuesta = T_Respuesta::findOrFail($id);

        $isAsignador = $user->email == $respuesta->email_asignador;
        if ($isAsignador) {
            $carpetas = $user->carpetas->pluck('id')->toArray();
            $compartidas = $user->carpetasCompartidas->pluck('id')->toArray();
            $globales = T_Carpeta::where('global', true)->pluck('id')->toArray();
            if ($respuesta->id_carpeta && !in_array($respuesta->id_carpeta, $carpetas) && !in_array($respuesta->id_carpeta, $compartidas) && !in_array($respuesta->id_carpeta, $globales)) {
                return $this->wrongResponse('No tienes permisos para acceder a este recurso');
            }
            return $this->successResponse(
                "Test obtenido correctamente.",
                new T_Test_RespuestaResource($respuesta)
            );
        }

        $isUser = $user->email == $respuesta->email_user;
        if ($isUser) {
            if (!$respuesta->fecha_visible) {
                return $this->wrongResponse('No puedes ver esto aún');
            }
            if (!$respuesta->interpretacion) {
                return $this->wrongResponse('No puedes ver esto aún');
            }
            return $this->successResponse(
                "Test obtenido correctamente.",
                new T_Test_RespuestaResource($respuesta)
            );
        }

        return $this->wrongResponse('No tienes permisos para acceder a este recurso');
    }

    public function updateDb(T_TestUpdateDbRequest $request)
    {
        $data = $request->validated();
        foreach ($data['tests'] as $test) {
            $version = T_TestVersion::where('id_test', $test['id'])->firstOrFail();
            $version->update([
                'test' => $test['test']
            ]);
        }
        $tests = T_Test::all();
        return $this->successResponse(
            "Tests actualizados correctamente.",
            T_TestsResource::collection($tests)
        );
    }
}
