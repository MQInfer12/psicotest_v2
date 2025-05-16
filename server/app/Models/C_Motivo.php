<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class C_Motivo extends Model
{
    use HasFactory;

    protected $table = "c_motivos";

    protected $guarded = [];

    protected $fillable = [
        'id_cita',
        'descripcion',
        'tipo',
        'email_psicologo',
        'email_paciente',
        'fecha_anterior',
        'hora_inicio_anterior',
        'hora_final_anterior',
        'fecha_nueva',
        'hora_inicio_nueva',
        'hora_final_nueva',
        'cancelado_por'
    ];

    public function psicologo()
    {
        return $this->belongsTo(U_user::class, 'email_psicologo', 'email');
    }

    public function paciente()
    {
        return $this->belongsTo(U_user::class, 'email_paciente', 'email');
    }

    public function cancelador()
    {
        return $this->belongsTo(U_user::class, 'cancelado_por', 'email');
    }
}
