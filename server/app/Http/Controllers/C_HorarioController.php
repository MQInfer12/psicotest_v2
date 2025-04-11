<?php

namespace App\Http\Controllers;

use App\Http\Requests\C_HorarioIndexRequest;
use App\Http\Requests\C_HorarioStoreRequest;
use App\Http\Resources\C_CitaResource;
use App\Http\Resources\C_HorarioResource;
use App\Http\Resources\C_OcupacionResource;
use App\Models\C_Cita;
use App\Models\C_Horario;
use App\Models\C_Ocupacion;
use App\Traits\ApiResponse;
use App\Traits\TimeTrait;
use Illuminate\Http\Request;

class C_HorarioController extends Controller
{
    use ApiResponse;
    use TimeTrait;

    public function index(C_HorarioIndexRequest $request)
    {
        $user = $request->user();
        $date = $request->input('date');

        $DAYS_FROM_NOW = 6;
        $DAYS_FROM_NOW_HORARIOS = $DAYS_FROM_NOW + 1;
        $END_DATE = date('Y-m-d', strtotime($date . " +$DAYS_FROM_NOW days"));

        $horarios = C_Horario::where('email_user', "!=", $user->email)
            ->whereHas('user', function ($query) {
                $query->where('disponible', true);
            })
            ->where(function ($query) use ($date, $DAYS_FROM_NOW_HORARIOS) {
                for ($i = -1; $i < $DAYS_FROM_NOW_HORARIOS - 1; $i++) {
                    $query->orWhere('dia', date('w', strtotime($date . " $i days")));
                }
            })->get();

        $citas = C_Cita::whereBetween('fecha', [$date, $END_DATE])->get();

        $ocupaciones = C_Ocupacion::whereBetween('fecha', [$date, $END_DATE])->get();

        return $this->successResponse(
            "Horarios obtenidos correctamente.",
            [
                'horarios' => C_HorarioResource::collection($horarios),
                'citas' => C_CitaResource::collection($citas),
                'ocupaciones' => C_OcupacionResource::collection($ocupaciones)
            ]
        );
    }

    public function indexForReprogramming(Request $request)
    {
        $user = $request->user();
        $today = $this->get_now_local()->format('Y-m-d');
        $fecha = $request->query('fecha') ?? $today;
        $dayIndex = (date('w', strtotime($fecha)) + 6) % 7;

        $horarios = C_Horario::where('email_user', $user->email)
            ->where('dia', $dayIndex)
            ->when($fecha === $today, function ($query) {
                $query->where('hora_inicio', '>', $this->get_now_local()->format('H:i:s'));
            })
            ->get();

        $citas = C_Cita::where('fecha', date('Y-m-d', strtotime($fecha)))
            ->where('email_psicologo', $user->email)
            ->get();

        $ocupaciones = C_Ocupacion::where('fecha', date('Y-m-d', strtotime($fecha)))
            ->where('email_user', $user->email)
            ->get();

        $disponibles = $horarios->filter(function ($horario) use ($citas, $ocupaciones) {
            foreach ($citas as $cita) {
                if ($this->check_overlaping_hour(
                    $cita->hora_inicio,
                    $cita->hora_final,
                    $horario->hora_inicio,
                    $horario->hora_final
                )) {
                    return false;
                }
            }

            foreach ($ocupaciones as $ocupacion) {
                if ($this->check_overlaping_hour(
                    $ocupacion->hora_inicio,
                    $ocupacion->hora_final,
                    $horario->hora_inicio,
                    $horario->hora_final
                )) {
                    return false;
                }
            }

            return true;
        });

        return $this->successResponse(
            "Horarios obtenidos correctamente.",
            C_HorarioResource::collection($disponibles)
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
