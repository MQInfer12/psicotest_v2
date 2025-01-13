<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class U_user extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

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
        'access_token',
        'refresh_token',
    ];

    public function raw_access_token()
    {
        return $this->access_token ? decrypt($this->access_token) : null;
    }

    public function raw_refresh_token()
    {
        return $this->refresh_token ? decrypt($this->refresh_token) : null;
    }

    public function carpetas()
    {
        return $this->hasMany(T_Carpeta::class, 'email_user')->orderBy('id', 'asc');
    }

    public function carpetasCompartidas()
    {
        return $this->belongsToMany(T_Carpeta::class, 't_carpeta_compartirs', 'email_user', 'id_carpeta');
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

    public function cita_proxima()
    {
        return $this->hasOne(C_Cita::class, 'email_paciente', 'email')
            ->whereRaw("CONCAT(fecha, ' ', hora_final) > ?", [Carbon::now()->subHours(4)->format('Y-m-d H:i:s')])
            ->orderBy('fecha', 'asc')
            ->orderBy('hora_inicio', 'asc');
    }

    public function citas_previas()
    {
        return $this
            ->hasMany(C_Cita::class, 'email_paciente', 'email')
            ->where('fecha', '<', now()->setTimezone('America/La_Paz'))
            ->orderBy("fecha", "desc");
    }
}
