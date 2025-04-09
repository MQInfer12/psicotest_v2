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
        $user = $request->user();
        $date = $request->input('date');

        $DAYS_FROM_NOW = 7;
        $horarios = C_Horario::where('email_user', "!=", $user->email)
            ->whereHas('user', function ($query) {
                $query->where('disponible', true);
            })
            ->where(function ($query) use ($date, $DAYS_FROM_NOW) {
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

    public function indexForReprogramming(Request $request)
    {
        $user = $request->user();
        $today = now()->setTimezone('America/La_Paz')->format('Y-m-d');
        $fecha = $request->query('fecha') ?? $today;
        $dayIndex = (date('w', strtotime($fecha)) + 6) % 7;

        $horarios = C_Horario::where('email_user', $user->email)
            ->where('dia', $dayIndex)
            ->when($fecha === $today, function ($query) {
                $query->where('hora_inicio', '>', now()->setTimezone('America/La_Paz')->format('H:i:s'));
            })
            ->get();

        $citas = C_Cita::where('fecha', date('Y-m-d', strtotime($fecha)))
            ->get();

        $horarios = $horarios->filter(function ($horario) use ($citas) {
            foreach ($citas as $cita) {
                $horaInicioCita = strtotime($cita->hora_inicio);
                $horaFinCita = strtotime($cita->hora_final);
                $horaInicioHorario = strtotime($horario->hora_inicio);
                $horaFinHorario = strtotime($horario->hora_final);

                $inicioOverlapping = $horaInicioCita >= $horaInicioHorario && $horaInicioCita < $horaFinHorario;
                $finalOverlapping = $horaFinCita > $horaInicioHorario && $horaFinCita <= $horaFinHorario;
                $insideOverlapping = $inicioOverlapping || $finalOverlapping;
                $outsideOverlapping = $horaInicioCita < $horaInicioHorario && $horaFinCita > $horaFinHorario;

                if ($insideOverlapping || $outsideOverlapping) {
                    return false;
                }
            }
            return true;
        });

        return $this->successResponse(
            "Horarios obtenidos correctamente.",
            C_HorarioResource::collection($horarios)
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
