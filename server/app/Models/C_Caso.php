<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class C_Caso extends Model
{
    use HasFactory;

    protected $table = "c_citas";

    protected $guarded = [];

    protected $fillable = [
        'email_paciente',
        'nombre',
        'motivo_cierre',
        'fecha_cierre'
    ];
}
