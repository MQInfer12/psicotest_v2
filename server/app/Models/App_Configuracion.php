<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class App_Configuracion extends Model
{
    use HasFactory;

    protected $table = "app_configuracions";

    protected $guarded = [];

    protected $fillable = [
        'configuraciones',
    ];
}
