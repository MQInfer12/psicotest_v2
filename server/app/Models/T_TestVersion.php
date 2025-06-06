<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class T_TestVersion extends Model
{
    use HasFactory;

    protected $table = "t_test_versions";

    protected $guarded = [];

    protected $fillable = [
        'id_test',
        'version',
        'test',
        'fecha',
    ];

    public function test_entity()
    {
        return $this->belongsTo(T_Test::class, 'id_test');
    }

    public function respuestas()
    {
        return $this->hasMany(T_Respuesta::class, 'id_test_version');
    }
}
