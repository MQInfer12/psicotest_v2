<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_MotivoReprogramacionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'descripcion' => 'string|required',
            'id_horario' => 'required|integer|exists:c_horarios,id',
            'fecha' => 'required|date|date_format:Y-m-d',
        ];
    }

    public function messages()
    {
        return [
            'descripcion.string' => 'La descripción debe ser una cadena de texto.',
            'descripcion.required' => 'La descripción es obligatoria.',
            'id_horario.required' => 'El ID del horario es obligatorio.',
            'id_horario.integer' => 'El ID del horario debe ser un número entero.',
            'id_horario.exists' => 'El ID del horario no existe.',
            'fecha.required' => 'La fecha es obligatoria.',
            'fecha.date' => 'La fecha debe ser una fecha válida.',
            'fecha.date_format' => 'La fecha debe estar en el formato Y-m-d.',
        ];
    }
}
