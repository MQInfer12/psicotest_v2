<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_CitaStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id_horario' => 'required|integer|exists:c_horarios,id',
            'fecha' => 'required|date|date_format:Y-m-d',
        ];
    }

    public function messages()
    {
        return [
            'id_horario.required' => 'El horario es requerido.',
            'id_horario.integer' => 'El id_horario tiene que ser un entero.',
            'id_horario.exists' => 'El horario seleccionado no existe.',
            'fecha.required' => 'La fecha es requerida.',
            'fecha.date' => 'La fecha tiene que ser una fecha válida.',
            'fecha.date_format' => 'La fecha tiene que tener el formato Y-m-d.',
        ];
    }
}
