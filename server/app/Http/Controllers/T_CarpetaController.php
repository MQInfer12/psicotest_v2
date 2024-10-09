<?php

namespace App\Http\Controllers;

use App\Http\Requests\T_CarpetaStoreRequest;
use App\Http\Requests\T_CarpetaUpdateRequest;
use App\Http\Resources\T_CarpetaResource;
use App\Models\T_Carpeta;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class T_CarpetaController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $user = $request->user();
        $carpetas = $user->carpetas;
        return $this->successResponse(
            "Carpetas obtenidas correctamente.",
            T_CarpetaResource::collection($carpetas)
        );
    }

    public function store(T_CarpetaStoreRequest $request)
    {
        $validatedData = $request->validated();
        $user = $request->user();
        $validatedData['email_user'] = $user->email;
        $carpeta = T_Carpeta::create($validatedData);
        return $this->successResponse(
            "Carpeta creada correctamente.",
            new T_CarpetaResource($carpeta)
        );
    }

    public function update(T_CarpetaUpdateRequest $request, $id)
    {
        $validatedData = $request->validated();
        $carpeta = T_Carpeta::findOrFail($id);
        $carpeta->update($validatedData);
        return $this->successResponse(
            "Carpeta actualizada correctamente.",
            new T_CarpetaResource($carpeta)
        );
    }

    public function destroy($id)
    {
        $carpeta = T_Carpeta::findOrFail($id);
        $carpeta->delete();
        return $this->successResponse(
            "Carpeta eliminada correctamente.",
            null
        );
    }
}
