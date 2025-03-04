<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class T_RespuestaPatchVisibilidadRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'ids' => 'array|min:1|required',
            'ids.*' => 'required|integer|exists:t_respuestas,id',
        ];
    }

    public function messages()
    {
        return [
            'ids.required' => 'El campo ids es obligatorio.',
            'ids.array' => 'El campo ids debe ser un arreglo.',
            'ids.min' => 'El campo ids debe tener al menos un elemento.',
            'ids.*.required' => 'El campo ids debe ser un arreglo de enteros.',
            'ids.*.integer' => 'El campo ids debe ser un arreglo de enteros.',
            'ids.*.exists' => 'Alguno de los ids no existe.',
        ];
    }
}
