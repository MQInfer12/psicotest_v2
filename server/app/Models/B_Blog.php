<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class B_Blog extends Model
{
    use HasFactory;

    protected $table = "b_blogs";

    protected $guarded = [];

    protected $fillable = [
        'titulo',
        'descripcion',
        'portada',
        'email_autor',
        'config',
        'destacado',
        'evento_nombre',
        'evento_fecha',
        'evento_latitud',
        'evento_longitud',
        'evento_direccion'
    ];

    public function autor()
    {
        return $this->belongsTo(U_User::class, 'email_autor', 'email');
    }

    public function asistencias()
    {
        return $this->hasManyThrough(B_Asistencia::class, B_Evento::class, 'id_blog', 'id_evento', 'id', 'id');
    }

    public function evento()
    {
        return $this->hasOne(B_Evento::class, 'id_blog');
    }
}
