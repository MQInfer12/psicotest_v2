<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_HorarioStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'dia' => 'required|integer|min:0|max:6',
            'hora_inicio' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'dia.required' => 'El día es requerido.',
            'dia.integer' => 'El día tiene que ser un entero.',
            'dia.min' => 'El día no puede ser menor a 0.',
            'dia.min' => 'El día no puede ser mayor a 6.',
            'hora_inicio.required' => 'La hora de inicio es requerida.',
            'hora_inicio.string' => 'La hora de inicio tiene que ser un string.',
        ];
    }
}
