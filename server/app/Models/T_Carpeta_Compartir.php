<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class T_Carpeta_Compartir extends Model
{
    use HasFactory;

    protected $table = "t_carpeta_compartirs";

    protected $guarded = [];

    protected $fillable = [
        'email_user',
        'id_carpeta'
    ];
}
