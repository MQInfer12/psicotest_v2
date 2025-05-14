<?php

namespace App\Http\Controllers;

use App\Constants\MetodoConsulta;
use App\Http\Requests\C_CasoCambiarNombreRequest;
use App\Http\Requests\C_CasoCerrarRequest;
use App\Http\Resources\C_CasoResource;
use App\Http\Resources\C_CitaResource;
use App\Models\C_Caso;
use App\Models\C_Cita;
use App\Models\C_Derivacion;
use App\Traits\ApiResponse;
use App\Traits\TimeTrait;

class C_CasoController extends Controller
{
    use ApiResponse;
    use TimeTrait;

    public function cambiarNombre(C_CasoCambiarNombreRequest $request, int $id)
    {
        $validatedData = $request->validated();

        $caso = C_Caso::findOrFail($id);

        $caso->update([
            'nombre' => $validatedData['nombre']
        ]);

        return $this->successResponse(
            "Nombre cambiado correctamente.",
            new C_CasoResource($caso)
        );
    }

    public function cerrarCaso(C_CasoCerrarRequest $request, int $id)
    {
        $validatedData = $request->validated();

        $caso = C_Caso::findOrFail($id);

        if ($validatedData['motivo_cierre'] == "Derivación") {
            C_Derivacion::create([
                'id_caso' => $caso->id,
                'derivado_a' => $validatedData['derivado_a'],
                'resumen' => $validatedData['resumen'],
            ]);
        }

        $caso->update([
            'motivo_cierre' => $validatedData['motivo_cierre'],
            'fecha_cierre' => now(),
        ]);

        return $this->successResponse(
            "Caso cerrado correctamente.",
            new C_CasoResource($caso->fresh())
        );
    }

    public function cerrarEIniciarNuevoDesdeCita(int $id_cita)
    {
        $cita = C_Cita::findOrFail($id_cita);
        $caso = $cita->caso;
        $caso->update([
            'motivo_cierre' => "Finalizado",
            'fecha_cierre' => now(),
        ]);
        $casoNuevo = C_Caso::create([
            'email_paciente' => $caso->email_paciente,
        ]);
        $cita->update([
            'metodo' => MetodoConsulta::PRIMERA_SESION_DEL_CASO,
            'metodo_inicial' => MetodoConsulta::PRIMERA_SESION_DEL_CASO,
            'id_caso' => $casoNuevo->id,
        ]);
        return $this->successResponse(
            "Caso anterior cerrado correctamente, iniciando uno nuevo.",
            new C_CitaResource($cita)
        );
    }
}
