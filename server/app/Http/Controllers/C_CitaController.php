<?php

namespace App\Http\Controllers;

use App\Http\Requests\C_CitaStoreRequest;
use App\Http\Resources\C_CitaResource;
use App\Http\Resources\U_userResource;
use App\Models\C_Cita;
use App\Models\C_Horario;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class C_CitaController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $citas = C_Cita::where('email_psicologo', $request->user()->email)->get();
        return $this->successResponse(
            "Citas encontradas correctamente.",
            C_CitaResource::collection($citas)
        );
    }

    public function store(C_CitaStoreRequest $request)
    {
        $validatedData = $request->validated();

        $user = $request->user();

        if ($user->cita_proxima) {
            return $this->wrongResponse("Ya tienes una cita próximamente.");
        }

        $horario = C_Horario::findOrFail($validatedData['id_horario']);
        if ($horario->email_user == $user->email) {
            return $this->wrongResponse("No puedes pedir una cita en un horario tuyo.");
        }

        C_Cita::create([
            'email_psicologo' => $horario->email_user,
            'email_paciente' => $user->email,
            'fecha' => $validatedData['fecha'],
            'hora_inicio' => $horario->hora_inicio,
            'hora_final' => $horario->hora_final,
        ]);

        $user->refresh();

        return $this->successResponse(
            "Cita creada correctamente.",
            new U_userResource($user)
        );
    }

    public function destroy(Request $request, int $id)
    {
        $cita = C_Cita::findOrFail($id);
        $cita->delete();

        return $this->successResponse(
            "Horario eliminado correctamente.",
            new U_userResource($request->user())
        );
    }
}
