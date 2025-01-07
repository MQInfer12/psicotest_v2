<?php

namespace App\Http\Controllers;

use App\Http\Requests\C_HorarioIndexRequest;
use App\Http\Requests\C_HorarioStoreRequest;
use App\Http\Resources\C_CitaResource;
use App\Http\Resources\C_HorarioResource;
use App\Models\C_Cita;
use App\Models\C_Horario;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class C_HorarioController extends Controller
{
    use ApiResponse;

    public function index(C_HorarioIndexRequest $request)
    {
        $date = $request->input('date');

        $DAYS_FROM_NOW = 7;
        $horarios = C_Horario::where(function ($query) use ($date, $DAYS_FROM_NOW) {
            for ($i = -1; $i < $DAYS_FROM_NOW - 1; $i++) {
                $query->orWhere('dia', date('w', strtotime($date . " $i days")));
            }
        })->get();
        $citas = C_Cita::where(function ($query) use ($date, $DAYS_FROM_NOW) {
            for ($i = -1; $i < $DAYS_FROM_NOW - 1; $i++) {
                $query->orWhere('fecha', date('Y-m-d', strtotime($date . " $i days")));
            }
        })->get();

        return $this->successResponse(
            "Horarios obtenidos correctamente.",
            [
                'horarios' => C_HorarioResource::collection($horarios),
                'citas' => C_CitaResource::collection($citas)
            ]
        );
    }

    public function indexForMe()
    {
        $horarios = C_Horario::all();
        return $this->successResponse(
            "Horarios obtenidos correctamente.",
            C_HorarioResource::collection($horarios)
        );
    }

    public function store(C_HorarioStoreRequest $request)
    {
        $validatedData = $request->validated();

        $hora_final = date('H:i:s', strtotime($validatedData['hora_inicio'] . ' + 1 hour'));

        $horariosAntes = C_Horario::where('dia', $validatedData['dia'])
            ->where('hora_inicio', '<=', $validatedData['hora_inicio'])
            ->where('hora_final', '>', $validatedData['hora_inicio'])
            /* ->where('email_user', $request->user()->email) */
            ->get();
        if ($horariosAntes->count() > 0) {
            return $this->wrongResponse("Esa hora ya esta ocupada con el horario de las " . date('H:i', strtotime($horariosAntes[0]->hora_inicio)));
        }

        $horariosDespues = C_Horario::where('dia', $validatedData['dia'])
            ->where('hora_inicio', '<', $hora_final)
            ->where('hora_final', '>=', $hora_final)
            /* ->where('email_user', $request->user()->email) */
            ->get();
        if ($horariosDespues->count() > 0) {
            return $this->wrongResponse("Esa hora ya esta ocupada con el horario de las " . date('H:i', strtotime($horariosDespues[0]->hora_inicio)));
        }

        //TODO: Bug al crear horario con hora_final 00:00:00

        $horario = C_Horario::create([
            "email_user" => $request->user()->email,
            "dia" => $validatedData['dia'],
            "hora_inicio" => $validatedData['hora_inicio'],
            "hora_final" => $hora_final
        ]);

        return $this->successResponse(
            "Horario creado correctamente.",
            new C_HorarioResource($horario)
        );
    }

    public function destroy(int $id)
    {
        $horario = C_Horario::findOrFail($id);
        $horario->delete();

        return $this->successResponse(
            "Horario eliminado correctamente.",
            null
        );
    }
}
