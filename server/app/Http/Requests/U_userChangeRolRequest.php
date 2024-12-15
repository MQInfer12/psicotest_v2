<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class U_userChangeRolRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id_rol' => 'required|integer|exists:u_rols,id',
        ];
    }

    public function messages()
    {
        return [
            'id_rol.required' => 'El id_rol es requerido.',
            'id_rol.integer' => 'El id_rol tiene que ser un entero.',
            'id_rol.exists' => 'El rol seleccionado no existe.'
        ];
    }
}
