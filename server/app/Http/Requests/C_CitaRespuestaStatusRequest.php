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
            'id_calendar' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'id_calendar.required' => 'El id_calendar es requerido.',
            'id_calendar.string' => 'El id_calendar tiene que ser un string.',
        ];
    }
}
