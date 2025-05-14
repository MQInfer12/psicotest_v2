<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_CasoCerrarRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'motivo_cierre' => 'string|required|in:Finalizado,Derivación',
            'derivado_a' => 'sometimes|string|nullable',
            'resumen' => 'sometimes|string|nullable',
        ];
    }

    public function messages()
    {
        return [
            'motivo_cierre.required' => 'El motivo de cierre es obligatorio.',
            'motivo_cierre.string' => 'El motivo de cierre debe ser una cadena de texto.',
            'motivo_cierre.in' => 'El motivo de cierre debe ser uno de los siguientes: Finalizado, Derivación.',
            'derivado_a.string' => 'El campo derivado_a debe ser una cadena de texto.',
            'resumen.string' => 'El campo resumen debe ser una cadena de texto.',
        ];
    }
}
