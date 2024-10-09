<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class T_CarpetaUpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'descripcion' => 'sometimes|required|string',
        ];
    }

    public function messages()
    {
        return [
            'descripcion.required' => 'La descripción es requerida.',
        ];
    }
}
