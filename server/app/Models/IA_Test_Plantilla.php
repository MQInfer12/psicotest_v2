<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IA_Test_Plantilla extends Model
{
    use HasFactory;

    protected $table = "ia_test_plantillas";

    protected $guarded = [];

    protected $fillable = [
        'id_test',
        'id_plantilla',
    ];
}
