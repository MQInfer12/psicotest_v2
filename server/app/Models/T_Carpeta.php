<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class T_Carpeta extends Model
{
    use HasFactory;

    protected $table = "t_carpetas";

    protected $guarded = [];

    protected $fillable = [
        'descripcion',
        'email_user',
        'global',
        'id_grupo'
    ];

    public function grupo()
    {
        return $this->belongsTo(T_Grupo::class, 'id_grupo');
    }

    public function respuestas()
    {
        return $this->hasMany(T_Respuesta::class, 'id_carpeta');
    }
}
