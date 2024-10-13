<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class T_RespuestaPatchInterpretationsRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'interpretaciones' => 'required|array',
            'interpretaciones.*.id' => 'required|integer|exists:t_respuestas,id',
            'interpretaciones.*.interpretacion' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'interpretaciones.required' => 'Las interpretaciones son requeridas.',
            'interpretaciones.*.id.required' => 'El ID es requerido para cada interpretación.',
            'interpretaciones.*.id.integer' => 'El ID debe ser un número entero.',
            'interpretaciones.*.id.exists' => 'El ID debe existir en la tabla de respuestas.',
            'interpretaciones.*.interpretacion.required' => 'La interpretación es requerida para cada elemento.',
        ];
    }
}
