<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_HorarioIndexRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'date' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'date.required' => 'El parámetro date es requerido.',
            'date.string' => 'El parámetro date d',
        ];
    }
}
