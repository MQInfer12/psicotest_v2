<?php

namespace App\Http\Controllers;

use App\Http\Resources\IA_PlantillaResource;
use App\Models\IA_Plantilla;
use App\Traits\ApiResponse;

class IA_PlantillaController extends Controller
{
    use ApiResponse;
    
    public function index()
    {
        $plantillas = IA_Plantilla::all();
        return $this->successResponse(
            "Usuarios obtenidos correctamente.",
            IA_PlantillaResource::collection($plantillas)
        );
    }
}
