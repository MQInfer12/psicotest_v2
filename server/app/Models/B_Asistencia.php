<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class B_Asistencia extends Model
{
    use HasFactory;

    protected $table = "b_asistencias";

    protected $guarded = [];

    protected $fillable = [
        'email_user',
        'id_evento',
        'id_calendar',
        'link_calendar',
    ];

    public function user()
    {
        return $this->belongsTo(U_User::class, 'email_user', 'email');
    }
}
