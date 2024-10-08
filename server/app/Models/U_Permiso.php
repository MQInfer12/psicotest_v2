<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class U_Permiso extends Model
{
    use HasFactory;

    protected $table = "u_permisos";

    protected $guarded = [];

    protected $fillable = [
        'descripcion',
    ];
}
