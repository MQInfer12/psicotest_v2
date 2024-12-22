<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class C_Horario extends Model
{
    use HasFactory;

    protected $table = "c_horarios";

    protected $guarded = [];

    protected $fillable = [
        'email_user',
        'dia',
        'hora_inicio',
        'hora_final'
    ];

    public function user()
    {
        return $this->belongsTo(U_user::class, 'email_user');
    }
}
