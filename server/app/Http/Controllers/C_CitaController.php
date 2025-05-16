<?php

namespace App\Http\Controllers;

use App\Constants\MetodoConsulta;
use App\Constants\Permisos;
use App\Http\Requests\C_CitaIndexRequest;
use App\Http\Requests\C_CitaRespuestaRequest;
use App\Http\Requests\C_CitaRespuestaStatusRequest;
use App\Http\Requests\C_CitaStoreRequest;
use App\Http\Requests\C_CitaUpdateRequest;
use App\Http\Resources\C_CasoResource;
use App\Http\Resources\C_CitaResource;
use App\Http\Resources\U_userResource;
use App\Models\C_Caso;
use App\Models\C_Cita;
use App\Models\C_Horario;
use App\Models\C_Motivo;
use App\Models\C_Ocupacion;
use App\Models\R_Contador;
use App\Models\U_Rol;
use App\Models\U_user;
use App\Traits\ApiResponse;
use App\Traits\GoogleAPIs;
use App\Traits\GoogleCalendarTrait;
use App\Traits\PermisosTrait;
use App\Traits\TimeTrait;
use Illuminate\Http\Request;

class C_CitaController extends Controller
{
    use ApiResponse;
    use GoogleAPIs;
    use GoogleCalendarTrait;
    use TimeTrait;
    use PermisosTrait;

    //region GETs

    public function index(C_CitaIndexRequest $request)
    {
        $previous = $request->input('previous');
        $email = $request->input('email');

        $user = $request->user();

        $citas = $previous ? C_Cita::query() : C_Cita::where('fecha', '>=', $this->get_now_local()->format('Y-m-d'));

        if ($email) {
            $citas = $citas->whereHas('caso', function ($query) use ($email) {
                $query->where('email_paciente', $email);
            });
        } else {
            $citas = $citas->where('email_psicologo', $user->email);
        }

        $citas = $citas->get();

        $citas = $previous
            ? $citas->sortByDesc(['fecha', 'hora_inicio'])
            : $citas->sortBy(['fecha', 'hora_inicio']);

        /* if (!$previous) {
            $access_token = $user->raw_access_token();
            if (!$access_token) {
                return $this->wrongResponse("El token de acceso es requerido.");
            }
            foreach ($citas as $cita) {
                $event = $this->fetchGoogleCalendarEvent($cita->id_calendar, $access_token, $user);
                // if ($event === false) {
                //     return $this->wrongResponse("Ocurrió un error al obtener las citas.");
                // }
                if ($event) {
                    foreach ($event->attendees as $attendee) {
                        if ($attendee->email == $user->email) {
                            $cita->estado = $attendee->responseStatus;
                            break;
                        }
                    }
                } else {
                    $cita->estado = 'needsAction';
                }
            }
        } */

        return $this->successResponse(
            "Citas encontradas correctamente.",
            C_CitaResource::collection($citas)
        );
    }

    public function show(int $id)
    {
        $cita = C_Cita::findOrFail($id);

        $me = request()->user();

        $puede_ver_todas = $this->tienePermiso($me, Permisos::ADMINISTRAR_PACIENTES);

        $paciente = $cita->caso->paciente;

        //? si no soy el psicólogo y no tengo permisos para ver todas las citas reviso si tengo alguna cita con el paciente
        if ($cita->email_psicologo != $me->email && !$puede_ver_todas) {
            $citas = C_Cita::whereHas('caso', function ($query) use ($paciente) {
                $query->where('email_paciente', $paciente->email);
            })->where('email_psicologo', $me->email)->get();
            if ($citas->isEmpty()) {
                return $this->wrongResponse("No tienes permisos para ver esto.");
            }
        }

        //? si no soy el psicólogo y tengo permisos para ver todas las citas reviso si la cita esta cerrada clínicamente
        if ($cita->email_psicologo != $me->email && $puede_ver_todas && !$cita->fecha_cierre_clinico) {
            return $this->wrongResponse("No tienes permisos para ver esto.");
        }

        return $this->successResponse(
            "Cita encontrada correctamente.",
            [
                'cita' => new C_CitaResource($cita),
                'paciente' => new U_userResource($paciente)
            ]
        );
    }

    public function showByPatient(string $email)
    {
        $user = U_user::findOrFail($email);
        $citas = $user->citas->filter(function ($cita) {
            return $cita->fecha_cierre_clinico !== null;
        });
        return $this->successResponse(
            "Citas encontradas correctamente.",
            C_CitaResource::collection($citas)
        );
    }

    public function showHistory(string $email)
    {
        $user = U_user::findOrFail($email);

        $historial = [];

        foreach ($user->casos as $caso) {
            $citas = $caso->citas()->orderBy('fecha', 'desc')->orderBy('hora_inicio', 'desc')->get();

            if ($citas->isNotEmpty()) {
                $historial[] = [
                    'tipo' => 'caso',
                    'fecha_hora' => $citas->first()->fecha . ' ' . $citas->first()->hora_inicio,
                    'data' => new C_CasoResource($caso),
                ];

                foreach ($citas as $cita) {
                    $historial[] = [
                        'tipo' => 'cita',
                        'fecha_hora' => $cita->fecha . ' ' . $cita->hora_inicio,
                        'data' => new C_CitaResource($cita),
                    ];
                }
            }
        }

        $historial = collect($historial)->sortByDesc('fecha_hora')->values();

        return $this->successResponse(
            "Citas encontradas correctamente.",
            $historial
        );
    }

    public function respuestaStatus(C_CitaRespuestaStatusRequest $request, string $id_calendar)
    {
        $access_token = $request->user()->raw_access_token();
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        $me = $request->input('me', false);
        $responseStatus = $this->getAttendeeResponseStatus($id_calendar, $access_token, $request->user(), $me);

        if ($responseStatus === false) {
            return $this->wrongResponse("Ocurrió un error al obtener el estado de la cita.");
        }

        return $this->successResponse(
            "Citas encontradas correctamente.",
            $responseStatus
        );
    }

    //region POSTs

    public function respuesta(C_CitaRespuestaRequest $request, int $id)
    {
        $cita = C_Cita::findOrFail($id);

        $validatedData = $request->validated();

        $user = $request->user();
        $access_token = $user->raw_access_token();
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        $body = [
            'attendees' => [
                [
                    'email' => $user->email,
                    'responseStatus' => $validatedData['estado']
                ]
            ]
        ];

        $success = $this->updateGoogleCalendarEvent($cita->id_calendar, $body, $access_token, $user);
        if (!$success) {
            return $this->wrongResponse("Nos falta permisos para manejar tu calendario de Google o el paciente eliminó el evento de su calendario.");
        }

        $cita->estado = $validatedData['estado'];

        return $this->successResponse(
            "Cita actualizada correctamente.",
            new C_CitaResource($cita)
        );
    }

    public function store(C_CitaStoreRequest $request)
    {
        $validatedData = $request->validated();

        $emailPaciente = $validatedData['email_paciente'] ?? null;
        $nombrePaciente = $validatedData['nombre_paciente'] ?? null;
        $anonimo = $validatedData['anonimo'] ?? false;
        $comprobarOcupaciones = $validatedData['comprobar_ocupaciones'] ?? true;

        $nuevoPaciente = null;
        if ($nombrePaciente) {
            $randomness = substr(str_shuffle(str_repeat('0123456789abcdefghijklmnopqrstuvwxyz', 8)), 0, 8);
            $nuevoEmail = strtolower(str_replace(' ', '_', $nombrePaciente)) . "_" . $randomness . "@neurall.com";
            $rolPorDefecto = U_Rol::where('por_defecto', true)->first();
            if (!$rolPorDefecto) {
                return $this->wrongResponse("No se encontró un rol por defecto.");
            }
            $nuevoPaciente = U_user::create([
                "email" => $nuevoEmail,
                "nombre" => $nombrePaciente,
                "id_rol" => $rolPorDefecto->id,
            ]);
        }

        $paciente = $nuevoPaciente ?? ($emailPaciente ? U_user::findOrFail($emailPaciente) : $request->user());

        if (!$emailPaciente && $paciente->cita_proxima) {
            return $this->wrongResponse("Ya tienes una cita próximamente.");
        }

        $horario = C_Horario::findOrFail($validatedData['id_horario']);
        if ($horario->email_user == $paciente->email) {
            return $this->wrongResponse("No puedes pedir una cita en un horario tuyo.");
        }

        $citasProximas = C_Cita::where('fecha', $validatedData['fecha'])
            ->where('email_psicologo', $horario->email_user)
            ->get();

        foreach ($citasProximas as $cita) {
            if ($this->check_overlaping_hour(
                $cita->hora_inicio,
                $cita->hora_final,
                $horario->hora_inicio,
                $horario->hora_final
            )) {
                return $this->wrongResponse("El horario de la cita se solapa con otra cita existente.");
            }
        }

        if ($comprobarOcupaciones) {
            $ocupacionesProximas = C_Ocupacion::where('fecha', $validatedData['fecha'])
                ->where('email_user', $horario->email_user)
                ->get();

            foreach ($ocupacionesProximas as $ocupacion) {
                if ($this->check_overlaping_hour(
                    $ocupacion->hora_inicio,
                    $ocupacion->hora_final,
                    $horario->hora_inicio,
                    $horario->hora_final
                )) {
                    return $this->wrongResponse("El horario de la cita no se encuentra disponible.");
                }
            }
        }

        $creador_evento = $request->user();
        $access_token = $creador_evento->raw_access_token();
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        $email_invitado = $emailPaciente ? $paciente->email : $horario->email_user;
        $body = $this->create_calendar_body(
            $horario->user->nombre,
            $validatedData['fecha'],
            $horario->hora_inicio,
            $horario->hora_final,
            $creador_evento->email,
            $email_invitado,
            $anonimo
        );

        $event = $this->createGoogleCalendarEvent($body, $access_token, $creador_evento);
        if (!$event) {
            return $this->wrongResponse("Para crear la cita necesitamos permisos para manejar tu calendario de Google, por favor vuelve a iniciar sesión y otorga los permisos necesarios.");
        }

        $caso = C_Caso::where('email_paciente', $paciente->email)
            ->whereNull('fecha_cierre')
            ->first();

        if (!$caso) {
            $caso = C_Caso::create([
                'email_paciente' => $paciente->email,
            ]);
        }

        $casosAnteriores = $caso->citas->filter(function ($cita) {
            return $cita->metodo !== MetodoConsulta::INASISTENCIA;
        });
        $primeraCita = $casosAnteriores->count() == 0;

        $cita = C_Cita::create([
            'id_calendar' => $event->id,
            'html_link_calendar' => $event->htmlLink,
            'creador_calendar' => $creador_evento->email,
            'id_caso' => $caso->id,
            'email_psicologo' => $horario->email_user,
            'fecha' => $validatedData['fecha'],
            'hora_inicio' => $horario->hora_inicio,
            'hora_final' => $horario->hora_final,
            'metodo' => $primeraCita ? MetodoConsulta::PRIMERA_SESION_DEL_CASO : MetodoConsulta::RECONSULTA,
            'metodo_inicial' => $primeraCita ? MetodoConsulta::PRIMERA_SESION_DEL_CASO : MetodoConsulta::RECONSULTA,
        ]);

        $paciente->refresh();

        return $this->successResponse(
            "Cita creada correctamente.",
            [
                "paciente" => new U_userResource($paciente),
                "cita" => new C_CitaResource($cita)
            ]
        );
    }

    //region PUTs

    public function update(C_CitaUpdateRequest $request, int $id)
    {
        $validatedData = $request->validated();

        $cita = C_Cita::findOrFail($id);

        if ($cita->email_psicologo != request()->user()->email) {
            return $this->wrongResponse("No tienes permisos para actualizar esta cita.");
        }

        $cita->update($validatedData);

        return $this->successResponse(
            "Cita actualizada correctamente.",
            new C_CitaResource($cita)
        );
    }

    public function closeClinically(Request $request, int $id)
    {
        $cita = C_Cita::findOrFail($id);

        if ($cita->email_psicologo != $request->user()->email) {
            return $this->wrongResponse("No tienes permisos para cerrar esta cita.");
        }

        $cita->update([
            'fecha_cierre_clinico' => $this->get_now_local()->format('Y-m-d')
        ]);

        $citasDelCaso = $cita->caso->citas;
        $citaSinLlenar = $citasDelCaso->where('observaciones', null)->first();
        $citasLlenadas = $citasDelCaso->where('observaciones', '!=', null);

        if ($citasLlenadas->every(fn($cita) => $cita->metodo === MetodoConsulta::INASISTENCIA)) {
            if ($citaSinLlenar) {
                $citaSinLlenar->update([
                    'metodo' => MetodoConsulta::INASISTENCIA,
                    'metodo_inicial' => MetodoConsulta::INASISTENCIA,
                ]);
            }
        }

        return $this->successResponse(
            "Cita cerrada clínicamente correctamente.",
            new C_CitaResource($cita)
        );
    }

    public function destroyWithToken(Request $request, int $id)
    {
        $me = $request->user();

        $cita = C_Cita::findOrFail($id);

        $user_creador = U_user::find($cita->creador_calendar);
        if ($user_creador) {
            $access_token_creador = $user_creador->raw_access_token();
            if (!$access_token_creador) {
                $this->deleteGoogleCalendarEvent($cita->id_calendar, $access_token_creador, $user_creador);
            } else {
                $me = $request->user();
                $this->deleteGoogleCalendarEvent($cita->id_calendar, $me->raw_access_token(), $me);
            }
        }

        C_Motivo::create([
            'descripcion' => "Cita cancelada por el paciente el día " . $this->get_now_local()->format('Y-m-d H:i:s'),
            'tipo' => 'cancelacion',
            'email_psicologo' => $cita->email_psicologo,
            'email_paciente' => $cita->caso->email_paciente,
            'fecha_anterior' => $cita->fecha,
            'hora_inicio_anterior' => $cita->hora_inicio,
            'hora_final_anterior' => $cita->hora_final,
            'cancelado_por' => $me->email,
        ]);

        $caso = $cita->caso;
        if ($caso->citas->count() == 1) {
            $caso->delete();
        } else {
            $cita->delete();
        }

        $contador = R_Contador::firstOrFail();
        $contador->citas_canceladas += 1;
        $contador->save();

        return $this->successResponse(
            "Cita cancelada correctamente.",
            new U_userResource($request->user())
        );
    }
}
