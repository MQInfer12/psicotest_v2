<?php

namespace App\Http\Controllers;

use App\Http\Resources\T_TestResource;
use App\Http\Resources\T_TestsResource;
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
}
