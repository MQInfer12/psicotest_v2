<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class T_CarpetaStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'descripcion' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'descripcion.required' => 'La descripción es requerida.',
        ];
    }
}
