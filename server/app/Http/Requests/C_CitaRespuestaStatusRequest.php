<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_CitaRespuestaStatusRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'access_token' => 'required|string',
            'id_calendar' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'access_token.required' => 'El access_token es requerido.',
            'access_token.string' => 'El access_token tiene que ser un string.',
            'id_calendar.required' => 'El id_calendar es requerido.',
            'id_calendar.string' => 'El id_calendar tiene que ser un string.',
        ];
    }
}
