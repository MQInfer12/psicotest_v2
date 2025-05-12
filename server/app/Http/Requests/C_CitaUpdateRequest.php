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
            'motivo' => 'sometimes|string|nullable',
            'antecedentes' => 'sometimes|string|nullable',
            'observaciones' => 'sometimes|required|string'
        ];
    }

    public function messages()
    {
        return [
            'metodo.required' => 'El método es requerido',
            'metodo.string' => 'El método debe ser una cadena de texto',
            'motivo.string' => 'El motivo debe ser una cadena de texto',
            'antecedentes.string' => 'Los antecedentes deben ser una cadena de texto',
            'observaciones.required' => 'El reporte de sesión es requerido',
            'observaciones.string' => 'El reporte de sesión deben ser una cadena de texto'
        ];
    }
}
