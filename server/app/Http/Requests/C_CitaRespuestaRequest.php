<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_CitaRespuestaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'estado' => 'required|string|in:accepted,declined',
            'access_token' => 'required|string'
        ];
    }

    public function messages()
    {
        return [
            'estado.required' => 'El estado es requerido.',
            'estado.string' => 'El estado tiene que ser una cadena.',
            'estado.in' => 'El estado debe ser "accepted" o "declined".',
            'access_token.required' => 'El access_token es requerido.',
            'access_token.string' => 'El access_token tiene que ser un string.'
        ];
    }
}
