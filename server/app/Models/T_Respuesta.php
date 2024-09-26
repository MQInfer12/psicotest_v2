<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class T_Respuesta extends Model
{
    use HasFactory;

    protected $table = "t_respuestas";

    protected $guarded = [];

    protected $fillable = [
        'id_test_version',
        'email_user',
        'email_asignador',
        'estado',
        'resultados',
        'interpretacion',
        'fecha_asignado',
        'fecha_enviado'
    ];

    public function user()
    {
        return $this->belongsTo(U_user::class, 'email_user');
    }

    public function test_version()
    {
        return $this->belongsTo(T_TestVersion::class, 'id_test_version');
    }

    public function asignador()
    {
        return $this->belongsTo(U_user::class, 'email_asignador', 'email');
    }
}
