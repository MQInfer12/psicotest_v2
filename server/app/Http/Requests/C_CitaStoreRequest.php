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
            'email_paciente' => 'sometimes|required|string',
            'nombre_paciente' => 'sometimes|required|string',
            'anonimo' => 'sometimes|boolean',
            'comprobar_ocupaciones' => 'sometimes|boolean',
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
            'email_paciente.required' => 'El email del paciente es requerido.',
            'email_paciente.string' => 'El email del paciente tiene que ser una cadena de texto.',
            'nombre_paciente.required' => 'El nombre del paciente es requerido.',
            'nombre_paciente.string' => 'El nombre del paciente tiene que ser una cadena de texto.',
        ];
    }
}
