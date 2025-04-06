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
        'permisos',
    ];

    protected $casts = [
        'permisos' => 'array'
    ];
    
    public function grupos()
    {
        return $this->belongsToMany(T_Grupo::class, 't_grupo_rols', 'id_rol', 'id_grupo');
    }

    public function carpetasGrupales()
    {
        return T_Carpeta::whereIn('id_grupo', $this->grupos()->pluck('t_grupos.id'))->get();
    }
}
