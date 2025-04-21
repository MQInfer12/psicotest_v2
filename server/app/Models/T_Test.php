<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class T_Test extends Model
{
    use HasFactory;

    protected $table = "t_tests";

    protected $guarded = [];

    protected $fillable = [
        'autor',
        'email_autor',
        'nombre',
        'canvas',
    ];

    public function autor_creador()
    {
        return $this->belongsTo(U_user::class, 'email_autor', 'email');
    }

    public function versions()
    {
        return $this->hasMany(T_TestVersion::class, 'id_test');
    }

    public function latest_version()
    {
        return $this->hasOne(T_TestVersion::class, 'id_test')->latestOfMany();
    }

    public function evaluados($user)
    {
        $versiones = $this->versions()->pluck('id');

        $evaluadosSinClasificacion = T_Respuesta::whereNull('id_carpeta')
            ->whereIn('id_test_version', $versiones)
            ->where('email_asignador', $user->email)
            ->with('user')
            ->get()
            ->pluck('user');

        $evaluadosTotales = $user->carpetasTotales()
            ->load('respuestas.test_version', 'respuestas.user')
            ->flatMap(
                fn($carpeta) => $carpeta->respuestas
                    ->filter(fn($respuesta) => $respuesta->test_version->id_test == $this->id)
                    ->pluck('user')
            );

        $evaluadosTotales = $evaluadosTotales->merge($evaluadosSinClasificacion)
            ->unique('email')
            ->sortBy('email')
            ->values();
            
       return $evaluadosTotales;
    }
}
