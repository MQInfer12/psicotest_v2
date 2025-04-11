<?php

namespace App\Http\Controllers;

use App\Http\Requests\C_OcupacionRequest;
use App\Http\Resources\C_OcupacionResource;
use App\Models\C_Ocupacion;
use App\Traits\ApiResponse;
use App\Traits\TimeTrait;
use Illuminate\Http\Request;

class C_OcupacionController extends Controller
{
    use ApiResponse;
    use TimeTrait;

    public function index(Request $request)
    {
        $me = $request->user();
        $ocupaciones = C_Ocupacion::where('email_user', $me->email)
            ->where('fecha', '>=', $this->get_now_local()->toDateString())
            ->get();
        return $this->successResponse(
            "Ocupaciones obtenidas correctamente.",
            C_OcupacionResource::collection($ocupaciones)
        );
    }

    public function store(C_OcupacionRequest $request)
    {
        $validatedData = $request->validated();
        $me = $request->user();

        $ocupacion = C_Ocupacion::create([
            'email_user' => $me->email,
            'descripcion' => $validatedData['descripcion'],
            'fecha' => $validatedData['fecha'],
            'hora_inicio' => $validatedData['hora_inicio'],
            'hora_final' => $validatedData['hora_final'],
        ]);

        return $this->successResponse(
            "Ocupación creada correctamente.",
            new C_OcupacionResource($ocupacion)
        );
    }

    public function update(C_OcupacionRequest $request, int $id)
    {
        $validatedData = $request->validated();

        $ocupacion = C_Ocupacion::findOrFail($id);
        $ocupacion->update($validatedData);

        return $this->successResponse(
            "Ocupación actualizada correctamente.",
            new C_OcupacionResource($ocupacion)
        );
    }

    public function destroy(int $id)
    {
        $ocupacion = C_Ocupacion::findOrFail($id);
        $ocupacion->delete();
        return $this->successResponse(
            "Ocupación eliminada correctamente.",
            null
        );
    }
}
