<?php

namespace App\Http\Controllers;

use App\Constants\Permisos;
use App\Models\B_Asistencia;
use App\Models\B_Blog;
use App\Models\B_Evento;
use App\Models\C_Cita;
use App\Models\T_Test;
use App\Models\U_user;
use App\Traits\ApiResponse;
use App\Traits\PermisosTrait;
use App\Traits\TimeTrait;
use Illuminate\Http\Request;

class ReportsController extends Controller
{
    use PermisosTrait;
    use ApiResponse;
    use TimeTrait;

    public function totals(Request $request)
    {
        $user = $request->user();
        if (!$this->tienePermiso($user, Permisos::VER_REPORTES)) {
            return $this->wrongResponse('No tienes permisos para ver reportes.');
        }

        $data = [];

        $tests = T_Test::all();
        $testsData = [];
        $testsTotals = [
            'sin_responder' => 0,
            'varones' => 0,
            'mujeres' => 0,
            'sin_especificar' => 0,
            'total' => 0,
        ];
        foreach ($tests as $test) {
            $versions = $test->versions;
            $cantidad_promedio = 0;
            $promedio_tiempo = 0;
            $sin_responder = 0;
            $varones = 0;
            $mujeres = 0;
            $sin_especificar = 0;
            foreach ($versions as $version) {
                $respuestas = $version->respuestas;
                foreach ($respuestas as $respuesta) {
                    $genero = $respuesta->user->genero;
                    if ($respuesta->estado == "Pendiente") {
                        $sin_responder++;
                    }
                    if ($genero === 'Hombre') {
                        $varones++;
                    } elseif ($genero === 'Mujer') {
                        $mujeres++;
                    } else {
                        $sin_especificar++;
                    }
                    if ($respuesta->tiempo) {
                        $cantidad_promedio++;
                        $promedio_tiempo += $respuesta->tiempo;
                    }
                }
            }

            if ($cantidad_promedio > 0) {
                $promedio_tiempo = $promedio_tiempo / $cantidad_promedio;
            }

            $testsTotals['sin_responder'] += $sin_responder;
            $testsTotals['varones'] += $varones;
            $testsTotals['mujeres'] += $mujeres;
            $testsTotals['sin_especificar'] += $sin_especificar;
            $testsTotals['total'] += $varones + $mujeres + $sin_especificar + $sin_responder;
            $testsData[] = [
                'id' => $test->id,
                'nombre' => $test->nombre,
                'tiempo_promedio' => $promedio_tiempo,
                'sin_responder' => $sin_responder,
                'varones' => $varones,
                'mujeres' => $mujeres,
                'sin_especificar' => $sin_especificar,
                'total' => $varones + $mujeres + $sin_especificar + $sin_responder,
            ];
        }
        $data['tests'] = $testsData;
        $data['tests_totals'] = $testsTotals;

        $gabinete = [];
        $gabineteTotals = [
            'varones' => 0,
            'mujeres' => 0,
            'total' => 0,
        ];
        $usuariosPsicologos = C_Cita::all()->pluck('email_psicologo')->unique();
        foreach ($usuariosPsicologos as $usuarioPsicologoEmail) {
            $user = U_user::findOrFail($usuarioPsicologoEmail);
            $varones = 0;
            $mujeres = 0;
            $citas = C_Cita::where('email_psicologo', $usuarioPsicologoEmail)->get();
            foreach ($citas as $cita) {
                $genero = $cita->paciente->genero;
                if ($genero === 'Hombre') {
                    $varones++;
                } elseif ($genero === 'Mujer') {
                    $mujeres++;
                }
            }
            $gabineteTotals['varones'] += $varones;
            $gabineteTotals['mujeres'] += $mujeres;
            $gabineteTotals['total'] += $varones + $mujeres;
            $gabinete[] = [
                'email' => $user->email,
                'nombre' => $user->nombre,
                'varones' => $varones,
                'mujeres' => $mujeres,
                'total' => $varones + $mujeres,
            ];
        }
        $data['gabinete'] = $gabinete;
        $data['gabinete_totals'] = $gabineteTotals;

        $pasadasSinAtender = C_Cita::where('fecha', '<', $this->get_now_local()->whereNull('metodo')->count());
        $pasadasAtendidas = C_Cita::where('fecha', '<', $this->get_now_local()->whereNotNull('metodo')->count());
        $pasadasDerivadas = C_Cita::where('fecha', '<', $this->get_now_local()->whereNotNull('derivado_a')->count());
        $data['gabinete_counters'] = [
            "pasadas_sin_atender" => $pasadasSinAtender,
            "pasadas_atendidas" => $pasadasAtendidas,
            "pasadas_derivadas" => $pasadasDerivadas,
        ];

        $blogsPopulares = [];
        $tresBlogsMasVistos = B_Blog::orderBy('visitas', 'desc')->limit(3)->get();
        foreach ($tresBlogsMasVistos as $blog) {
            $blogsPopulares[] = [
                'id' => $blog->id,
                'titulo' => $blog->titulo,
                'visitas' => $blog->visitas,
            ];
        }
        $data['blogs_populares'] = $blogsPopulares;
        $eventosPopulares = [];
        $tresEventosMasPopulares = B_Asistencia::select('id_evento')->groupBy('id_evento')->orderByRaw('COUNT(*) DESC')->limit(3)->get();
        foreach ($tresEventosMasPopulares as $evento) {
            $evento = B_Evento::findOrFail($evento->id_evento);
            $eventosPopulares[] = [
                'id' => $evento->id,
                'nombre' => $evento->nombre,
                'asistencias' => B_Asistencia::where('id_evento', $evento->id)->count(),
            ];
        }
        $data['eventos_populares'] = $eventosPopulares;

        return $this->successResponse(
            "Reporte obtenido correctamente.",
            $data
        );
    }
}
