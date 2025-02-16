<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class B_Evento extends Model
{
    use HasFactory;

    protected $table = "b_eventos";

    protected $guarded = [];

    protected $fillable = [
        'id_blog',
        'nombre',
        'fecha',
        'latitud',
        'longitud',
        'direccion',
    ];
}
