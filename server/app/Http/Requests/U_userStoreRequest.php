<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class U_userStoreRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => 'required|string|email|unique:u_users,email',
            'nombre' => 'required|string',
            'foto' => 'nullable|string',
            'genero' => 'nullable|string',
            'fecha_nacimiento' => 'nullable|date',
            'nacionalidad' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'email.required' => 'El correo es requerido.',
            'email.email' => 'El formato del correo es inválido.',
            'email.unique' => 'Este correo ya está registrado.',
            'nombre.required' => 'El nombre es requerido.',
            'nombre.string' => 'El nombre debe ser una cadena de caracteres.',
        ];
    }
}
