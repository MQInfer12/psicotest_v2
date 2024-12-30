<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class T_RespuestaStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id_test' => 'required|array|min:1',
            "id_test.*" => 'integer|exists:t_tests,id',
            'email_asignador' => 'required|email|string|exists:u_users,email',
            'id_carpeta' => 'nullable|integer|exists:t_carpetas,id'
        ];
    }

    public function messages()
    {
        return [
            'email_asignador.required' => 'El correo del asignador es requerido.',
            'email_asignador.email' => 'El formato del correo es inválido.',
            'email_asignador.exists' => 'No se encontró el asignador',
            'id_test.required' => 'id_test es requerido.',
            'id_test.min' => 'id_test debe tener al menos un elemento.',
            'id_test.array' => 'id_test tiene que ser un array',
            'id_test.*.integer' => 'Cada valor en el array id_test debe ser un número entero.',
            'id_test.*.exists' => 'No se encontró algún test',
            'id_carpeta.exists' => 'No se encontró la carpeta'
        ];
    }
}
