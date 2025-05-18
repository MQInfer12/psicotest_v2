<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class C_Nota extends Model
{
    use HasFactory;

    protected $table = "c_notas";

    protected $guarded = [];

    protected $fillable = [
        'email_psicologo',
        'descripcion',
        'id_cita',
        'id_caso'
    ];

    public function psicologo()
    {
        return $this->belongsTo(U_user::class, 'email_psicologo', 'email');
    }

    public function paciente()
    {
        if ($this->id_cita) {
            $cita = C_Cita::with('caso')->findOrFail($this->id_cita);
            return U_user::where('email', $cita->caso->email_paciente)->first();
        }

        if ($this->id_caso) {
            $caso = C_Caso::findOrFail($this->id_caso);
            return U_user::where('email', $caso->email_paciente)->first();
        }

        throw new \Exception('La nota no tiene ni id_cita ni id_caso. No se puede determinar el paciente.');
    }
}
