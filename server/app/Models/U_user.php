<?php

namespace App\Models;

use App\Constants\Permisos;
use App\Constants\Requerimientos;
use App\Traits\PermisosTrait;
use App\Traits\TimeTrait;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class U_user extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;
    use PermisosTrait;
    use TimeTrait;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'email';
    protected $table = "u_users";

    protected $guarded = [];

    protected $fillable = [
        'email',
        'nombre',
        'foto',
        'genero',
        'fecha_nacimiento',
        'carrera',
        'semestre',
        'codigo_estudiantil',
        'telefono',
        'nombre_tutor',
        'telefono_tutor',
        'estado',
        'id_rol',
        'nombre_verificado',
        'access_token',
        'refresh_token',
        'ultima_conexion',
        'institucion',
        'curso',
        'municipio'
    ];

    public function raw_access_token()
    {
        return $this->access_token ? decrypt($this->access_token) : null;
    }

    public function raw_refresh_token()
    {
        return $this->refresh_token ? decrypt($this->refresh_token) : null;
    }

    public function respuestas()
    {
        return $this->hasMany(T_Respuesta::class, 'email_user')->orderBy('id', 'asc');
    }

    public function asignados()
    {
        return $this->hasMany(T_Respuesta::class, 'email_asignador')->orderBy('id', 'asc');
    }

    public function rol()
    {
        return $this->belongsTo(U_Rol::class, 'id_rol');
    }

    public function grupos()
    {
        return $this->tienePermiso($this, Permisos::VER_TODAS_LAS_CARPETAS) ? T_Grupo::all() : $this->rol->grupos;
    }

    public function carpetas()
    {
        return $this->hasMany(T_Carpeta::class, 'email_user')->where('id_grupo', null)->orderBy('id', 'asc');
    }

    public function carpetasTotales()
    {
        if ($this->tienePermiso($this, Permisos::VER_TODAS_LAS_CARPETAS)) return T_Carpeta::all();

        $carpetasPropias = $this->carpetas;
        $carpetasDeGrupo = $this->rol->carpetasGrupales();
        $carpetasGlobales = T_Carpeta::where('global', true)->get();

        $carpetasTotales = $carpetasPropias
            ->merge($carpetasDeGrupo)
            ->merge($carpetasGlobales)
            ->sortBy('descripcion')
            ->values();

        return $carpetasTotales;
    }

    public function cita_proxima()
    {
        return $this->hasOneThrough(
            C_Cita::class,
            C_Caso::class,
            'email_paciente',
            'id_caso',
            'email',
            'id'
        )->whereRaw("CONCAT(fecha, ' ', hora_final) > ?", [Carbon::now()->subHours(4)->format('Y-m-d H:i:s')])
            ->orderBy('fecha', 'asc')
            ->orderBy('hora_inicio', 'asc');
    }

    public function citas()
    {
        return $this
            ->hasManyThrough(
                C_Cita::class,
                C_Caso::class,
                'email_paciente',
                'id_caso',
                'email',
                'id'
            )
            ->orderBy("fecha", "desc");
    }
}
