<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class C_MotivoConsulta extends Model
{
    use HasFactory;

    protected $table = "c_motivo_consultas";

    protected $guarded = [];

    protected $fillable = [
        'descripcion',
    ];
}
