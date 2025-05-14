<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_CasoCambiarNombreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nombre' => 'string|nullable',
        ];
    }

    public function messages()
    {
        return [
            'nombre.string' => 'La nombre debe ser una cadena de texto.',
        ];
    }
}
