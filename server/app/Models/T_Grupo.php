<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class T_Grupo extends Model
{
    use HasFactory;

    protected $table = "t_grupos";

    protected $guarded = [];

    protected $fillable = [
        'descripcion',
    ];

    public function carpetas()
    {
        return $this->hasMany(T_Carpeta::class, 'id_grupo');
    }

    public function roles()
    {
        return $this->belongsToMany(U_Rol::class, 't_grupo_rols', 'id_grupo', 'id_rol');
    }
}
