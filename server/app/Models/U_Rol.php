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
        'por_defecto'
    ];

    public function permisos()
    {
        return $this->belongsToMany(U_Permiso::class, 'u_rol_permisos', 'id_rol', 'id_permiso');
    }
}
