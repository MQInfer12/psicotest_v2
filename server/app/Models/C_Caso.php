<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class C_Caso extends Model
{
    use HasFactory;

    protected $table = "c_casos";

    protected $guarded = [];

    protected $fillable = [
        'email_paciente',
        'nombre',
        'motivo_cierre',
        'fecha_cierre',
        'descripcion_cierre'
    ];

    public function paciente()
    {
        return $this->belongsTo(U_user::class, 'email_paciente', 'email');
    }

    public function citas()
    {
        return $this->hasMany(C_Cita::class, 'id_caso', 'id');
    }

    public function derivacion()
    {
        return $this->hasOne(C_Derivacion::class, 'id_caso', 'id');
    }
}
