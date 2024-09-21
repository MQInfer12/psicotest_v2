<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class T_Test extends Model
{
    use HasFactory;

    protected $table = "t_tests";

    protected $guarded = [];

    protected $fillable = [
        'autor',
        'email_autor',
        'nombre',
        'canvas',
    ];

    public function autor_creador()
    {
        return $this->belongsTo(U_user::class, 'email_autor', 'email');
    }

    public function versions()
    {
        return $this->hasMany(T_TestVersion::class, 'id_test');
    }

    public function latest_version()
    {
        return $this->hasOne(T_TestVersion::class, 'id_test')->latestOfMany();
    }
}
