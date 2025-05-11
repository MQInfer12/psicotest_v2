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

    public function paciente()
    {
        return $this->belongsTo(U_user::class, 'email_paciente', 'email');
    }

    public function cita_proxima()
    {
        $siguiente_cita = C_Cita::where('email_psicologo', $this->email_psicologo)
            ->where('email_paciente', $this->email_paciente)
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
        return $siguiente_cita;
    }
}
