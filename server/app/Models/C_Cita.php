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
        'email_psicologo',
        'email_paciente',
        'fecha',
        'hora_inicio',
        'hora_final'
    ];

    public function psicologo()
    {
        return $this->belongsTo(U_user::class, 'email_psicologo', 'email');
    }

    public function paciente()
    {
        return $this->belongsTo(U_user::class, 'email_paciente', 'email');
    }
}
