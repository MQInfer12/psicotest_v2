<?php

namespace App\Models;

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
    ];

    public function respuestas()
    {
        return $this->hasMany(T_Respuesta::class, 'email_user');
    }

    public function asignados()
    {
        return $this->hasMany(T_Respuesta::class, 'email_asignador');
    }
}
