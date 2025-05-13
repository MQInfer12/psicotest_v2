<?php

namespace App\Http\Controllers;

use App\Constants\MetodoConsulta;
use App\Http\Resources\C_CitaResource;
use App\Models\C_Caso;
use App\Models\C_Cita;
use App\Traits\ApiResponse;
use App\Traits\TimeTrait;
use Illuminate\Http\Request;

class C_CasoController extends Controller
{
    use ApiResponse;
    use TimeTrait;

    public function cerrarEIniciarNuevoDesdeCita(int $id_cita)
    {
        $cita = C_Cita::findOrFail($id_cita);
        $caso = $cita->caso;
        $caso->update([
            'motivo_cierre' => "Cierre de caso por nueva cita",
            'fecha_cierre' => $this->get_now_local()->format('Y-m-d'),
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
