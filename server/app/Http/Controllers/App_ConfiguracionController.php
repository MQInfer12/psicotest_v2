<?php

namespace App\Http\Controllers;

use App\Http\Requests\App_ConfiguracionRequest;
use App\Http\Resources\App_ConfiguracionResource;
use App\Models\App_Configuracion;
use App\Traits\ApiResponse;

class App_ConfiguracionController extends Controller
{
    use ApiResponse;

    public function showSettings()
    {
        $config = App_Configuracion::firstOrFail();
        return $this->successResponse(
            "Configuración obtenida correctamente",
            new App_ConfiguracionResource($config)
        );
    }

    public function patchSettings(App_ConfiguracionRequest $request)
    {
        $data = $request->validated();
        $config = App_Configuracion::firstOrFail();
        $config->update([
            "configuraciones" => json_encode($data)
        ]);
        return $this->successResponse(
            "Configuración cambiada correctamente",
            new App_ConfiguracionResource($config)
        );
    }
}
