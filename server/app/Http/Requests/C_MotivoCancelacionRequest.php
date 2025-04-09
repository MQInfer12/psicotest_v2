<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_MotivoCancelacionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'descripcion' => 'string|required',
        ];
    }

    public function messages()
    {
        return [
            'descripcion.string' => 'La descripción debe ser una cadena de texto.',
            'descripcion.required' => 'La descripción es obligatoria.',
        ];
    }
}
