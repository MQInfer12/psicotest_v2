<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class R_Contador extends Model
{
    use HasFactory;

    protected $table = "r_contadors";

    protected $guarded = [];

    protected $fillable = [
        'citas_canceladas'
    ];
}
