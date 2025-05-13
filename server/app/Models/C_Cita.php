<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class C_Cita extends Model
{
    use HasFactory;

    protected $table = "c_citas";

    protected $guarded = [];

    protected $fillable = [
        'id_calendar',
        'html_link_calendar',
        'creador_calendar',

        'id_caso',

        'email_psicologo',
        'fecha',
        'hora_inicio',
        'hora_final',

        'metodo',
        'metodo_inicial',
        'id_motivo_consulta',
        'motivo',
        'antecedentes',
        'observaciones',

        'fecha_cierre_clinico',
    ];

    public function psicologo()
    {
        return $this->belongsTo(U_user::class, 'email_psicologo', 'email');
    }

    public function caso()
    {
        return $this->belongsTo(C_Caso::class, 'id_caso', 'id');
    }

    public function motivo_consulta()
    {
        return $this->belongsTo(C_MotivoConsulta::class, 'id_motivo_consulta', 'id');
    }

    public function cita_proxima()
    {
        $emailPaciente = $this->caso->email_paciente;
        $cita_proxima = C_Cita::where('email_psicologo', $this->email_psicologo)
            ->whereHas('caso', function ($query) use ($emailPaciente) {
                $query->where('email_paciente', $emailPaciente);
            })
            ->where(function ($query) {
                $query->where('fecha', '>', $this->fecha)
                    ->orWhere(function ($query) {
                        $query->where('fecha', $this->fecha)
                            ->where('hora_inicio', '>', $this->hora_inicio);
                    });
            })
            ->orderBy('fecha', 'asc')
            ->orderBy('hora_inicio', 'asc')
            ->first();
        return $cita_proxima;
    }

    public function cita_anterior()
    {
        $emailPaciente = $this->caso->email_paciente;
        $cita_anterior = C_Cita::where('email_psicologo', $this->email_psicologo)
            ->whereHas('caso', function ($query) use ($emailPaciente) {
                $query->where('email_paciente', $emailPaciente);
            })
            ->where(function ($query) {
                $query->where('fecha', '<', $this->fecha)
                    ->orWhere(function ($query) {
                        $query->where('fecha', $this->fecha)
                            ->where('hora_inicio', '<', $this->hora_inicio);
                    });
            })
            ->orderBy('fecha', 'desc')
            ->orderBy('hora_inicio', 'desc')
            ->first();
        return $cita_anterior;
    }
}
