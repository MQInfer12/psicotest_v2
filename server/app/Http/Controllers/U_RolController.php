<?php

namespace App\Http\Controllers;

use App\Http\Resources\U_RolResource;
use App\Models\U_Rol;
use App\Traits\ApiResponse;

class U_RolController extends Controller
{
    use ApiResponse;
    
    public function index()
    {
        $rols = U_Rol::all();
        return $this->successResponse(
            "Roles obtenidos correctamente.",
            U_RolResource::collection($rols)
        );
    }
}
