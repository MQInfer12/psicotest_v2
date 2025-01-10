<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_CitaUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'metodo' => 'sometimes|required|string',
            'motivo' => 'sometimes|required|string',
            'antecedentes' => 'sometimes|required|string',
            'observaciones' => 'sometimes|required|string',
            'derivado_a' => 'sometimes|string|nullable',
            'resumen' => 'sometimes|string|nullable',
        ];
    }

    public function messages()
    {
        return [
            'metodo.required' => 'El método es requerido',
            'metodo.string' => 'El método debe ser una cadena de texto',
            'motivo.required' => 'El motivo es requerido',
            'motivo.string' => 'El motivo debe ser una cadena de texto',
            'antecedentes.required' => 'Los antecedentes son requeridos',
            'antecedentes.string' => 'Los antecedentes deben ser una cadena de texto',
            'observaciones.required' => 'Las observaciones son requeridas',
            'observaciones.string' => 'Las observaciones deben ser una cadena de texto',
            'derivado_a.string' => 'El derivado a debe ser una cadena de texto',
            'resumen.string' => 'El resumen debe ser una cadena de texto',
        ];
    }
}
