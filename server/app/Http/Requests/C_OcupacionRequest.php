<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_OcupacionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'descripcion' => 'required|string',
            'fecha' => 'required|date|date_format:Y-m-d',
            'hora_inicio' => 'required|string',
            'hora_final' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'descripcion.required' => 'La descripción es requerida.',
            'descripcion.string' => 'La descripción tiene que ser una cadena de texto.',
            'fecha.required' => 'La fecha es requerida.',
            'fecha.date' => 'La fecha tiene que ser una fecha válida.',
            'fecha.date_format' => 'La fecha tiene que tener el formato Y-m-d.',
            'hora_inicio.required' => 'La hora de inicio es requerida.',
            'hora_inicio.string' => 'La hora de inicio tiene que ser una cadena de texto.',
            'hora_final.required' => 'La hora final es requerida.',
            'hora_final.string' => 'La hora final tiene que ser una cadena de texto.',
        ];
    }
}
