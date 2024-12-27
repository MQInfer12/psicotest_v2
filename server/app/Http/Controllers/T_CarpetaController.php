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

        $carpetasPropias = $user->carpetas->map(function ($carpeta) {
            $carpeta->tipo = 'propia';
            return $carpeta;
        });

        $carpetasCompartidas = $user->carpetasCompartidas->map(function ($carpeta) {
            $carpeta->tipo = 'compartida';
            return $carpeta;
        });

        $carpetasGlobales = T_Carpeta::where('global', true)->get()->map(function ($carpeta) {
            $carpeta->tipo = 'global';
            return $carpeta;
        });

        $carpetasTotales = $carpetasPropias->merge($carpetasCompartidas);
        $carpetasTotales = $carpetasTotales->merge($carpetasGlobales);
        $carpetasTotales = $carpetasTotales->sortBy('id');

        return $this->successResponse(
            "Carpetas obtenidas correctamente.",
            T_CarpetaResource::collection($carpetasTotales)
        );
    }

    public function store(T_CarpetaStoreRequest $request)
    {
        $validatedData = $request->validated();
        $user = $request->user();
        $validatedData['email_user'] = $user->email;
        $carpeta = T_Carpeta::create($validatedData);
        $carpeta->tipo = 'propia';

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

        $user = $request->user();
        if ($carpeta->email_user == $user->email) {
            $carpeta->tipo = 'propia';
        } else {
            $carpeta->tipo = 'compartida';
        }

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
