<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IA_Plantilla extends Model
{
    use HasFactory;

    protected $table = "ia_plantillas";

    protected $guarded = [];

    protected $fillable = [
        'descripcion',
        'plantilla',
    ];

    public function tests()
    {
        return $this->belongsToMany(T_Test::class, 'ia_test_plantillas', 'id_plantilla', 'id_test');
    }
}
