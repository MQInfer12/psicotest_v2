<?php

namespace App\Models;

use App\Traits\TimeTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class C_Ocupacion extends Model
{
    use HasFactory;
    use TimeTrait;

    protected $table = "c_ocupacions";

    protected $guarded = [];

    protected $fillable = [
        'email_user',
        'descripcion',
        'fecha',
        'hora_inicio',
        'hora_final',
    ];

    public function citas_colindantes()
    {
        $citas = C_Cita::where('fecha', $this->fecha)->where('email_psicologo', $this->email_user)->get();
        $citas_colindantes = [];
        foreach ($citas as $cita) {
            if ($this->check_overlaping_hour($this->hora_inicio, $this->hora_final, $cita->hora_inicio, $cita->hora_final)) {
                $citas_colindantes[] = $cita;
            }
        }
        return $citas_colindantes;
    }
}
