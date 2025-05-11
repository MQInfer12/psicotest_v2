<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class C_Nota extends Model
{
    use HasFactory;

    protected $table = "c_notas";

    protected $guarded = [];

    protected $fillable = [
        'email_paciente',
        'email_psicologo',
        'descripcion',
        'fecha_hora',
    ];
}
