<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class T_Grupo_Rol extends Model
{
    use HasFactory;

    protected $table = "t_grupo_rols";

    protected $guarded = [];

    protected $fillable = [
        'id_grupo',
        'id_rol',
    ];
}
