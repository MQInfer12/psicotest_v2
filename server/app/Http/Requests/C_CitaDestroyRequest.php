<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_CitaDestroyRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'access_token' => 'required|string'
        ];
    }

    public function messages()
    {
        return [
            'access_token.required' => 'El access_token es requerido.',
            'access_token.string' => 'El access_token tiene que ser un string.'
        ];
    }
}
