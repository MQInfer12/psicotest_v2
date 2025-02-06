<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class B_Blog extends Model
{
    use HasFactory;

    protected $table = "b_blogs";

    protected $guarded = [];

    protected $fillable = [
        'titulo',
        'descripcion',
        'portada',
        'email_autor',
        'config',
        'destacado',
    ];

    public function autor()
    {
        return $this->belongsTo(U_User::class, 'email_autor', 'email');
    }
}
