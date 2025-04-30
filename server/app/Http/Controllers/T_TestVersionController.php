<?php

namespace App\Http\Controllers;

use App\Http\Resources\T_TestVersionResource;
use App\Models\T_TestVersion;
use App\Traits\ApiResponse;

class T_TestVersionController extends Controller
{
    use ApiResponse;

    public function showByTest(int $id)
    {
        $testVersions = T_TestVersion::where('id_test', $id)->orderBy('version')->get();
        return $this->successResponse("Versiones obtenidas correctamente", T_TestVersionResource::collection($testVersions));
    }
}
