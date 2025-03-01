<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class T_RespuestaUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'resultados' => 'required|string',
            'tiempo' => 'sometimes|required|numeric',
        ];
    }

    public function messages()
    {
        return [
            'resultados.required' => 'Los resultados son requeridos.',
            'tiempo.required' => 'El tiempo es requerido.',
            'tiempo.numeric' => 'El tiempo debe ser un número.',
        ];
    }
}
