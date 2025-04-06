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
            'id_grupo' => 'nullable|integer|exists:t_grupos,id',
        ];
    }

    public function messages()
    {
        return [
            'descripcion.required' => 'La descripción es requerida.',
            'descripcion.string' => 'La descripción debe ser una cadena de texto.',
            'id_grupo.integer' => 'El ID del grupo debe ser un número entero.',
            'id_grupo.exists' => 'El grupo especificado no existe.',
        ];
    }
}
