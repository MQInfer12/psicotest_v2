<?php

namespace App\Http\Controllers;

use App\Http\Resources\T_TestResource;
use App\Http\Resources\T_TestsResource;
use App\Models\T_Respuesta;
use App\Models\T_Test;
use App\Traits\ApiResponse;

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

    public function show($id)
    {
        $test = T_Test::findOrFail($id);
        return $this->successResponse(
            "Test obtenido correctamente.",
            new T_TestResource($test)
        );
    }

    public function showByRespuesta($id)
    {
        $respuesta = T_Respuesta::findOrFail($id);
        $test = T_Test::findOrFail($respuesta->test_version->id_test);
        return $this->successResponse(
            "Test obtenido correctamente.",
            new T_TestResource($test)
        );
    }

    public function getMapiAnswers()
    {
        $answers = [];

        for ($i = 1; $i <= 150; $i++) {
            $answers[] = [
                "idPregunta" => $i,
                "idOpcion" => rand(1, 5)
            ];
        }

        return $this->successResponse("Respuestas MAPI generadas correctamente", $answers);
    }
}
