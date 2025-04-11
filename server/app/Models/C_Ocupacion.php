<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class C_Ocupacion extends Model
{
    use HasFactory;

    protected $table = "c_ocupacions";

    protected $guarded = [];

    protected $fillable = [
        'email_user',
        'descripcion',
        'fecha',
        'hora_inicio',
        'hora_final',
    ];
}
