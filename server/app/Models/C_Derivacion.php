<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class C_Derivacion extends Model
{
    use HasFactory;

    protected $table = "c_derivacions";

    protected $guarded = [];

    protected $fillable = [
        'id_caso',
        'derivado_a',
        'resumen',
    ];
}
