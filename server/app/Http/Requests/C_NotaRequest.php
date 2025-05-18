<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_NotaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'descripcion' => 'string|required',
            'id_caso' => 'sometimes|integer|exists:c_casos,id',
            'id_cita' => 'sometimes|integer|exists:c_citas,id',
        ];
    }

    public function messages()
    {
        return [
            'descripcion.string' => 'La descripción debe ser una cadena de texto.',
            'descripcion.required' => 'La descripción es obligatoria.',
            'id_caso.integer' => 'El ID del caso debe ser un número entero.',
            'id_caso.exists' => 'El ID del caso no existe en la base de datos.',
            'id_cita.integer' => 'El ID de la cita debe ser un número entero.',
            'id_cita.exists' => 'El ID de la cita no existe en la base de datos.',
        ];
    }
}
