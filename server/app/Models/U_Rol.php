<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class U_Rol extends Model
{
    use HasFactory;

    protected $table = "u_rols";

    protected $guarded = [];

    protected $fillable = [
        'descripcion',
        'por_defecto',
        'permisos'
    ];

    protected $casts = [
        'permisos' => 'array'
    ];
}
