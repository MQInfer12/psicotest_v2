<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class U_Rol_Permiso extends Model
{
    use HasFactory;

    protected $table = "u_rol_permisos";

    protected $guarded = [];

    protected $fillable = [
        'id_rol',
        'id_permiso'
    ];
}
