<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class T_Grupo_User extends Model
{
    use HasFactory;

    protected $table = "t_grupo_users";

    protected $guarded = [];

    protected $fillable = [
        'id_grupo',
        'email_user',
    ];
}
