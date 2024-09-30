<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class T_TestUpdateDbRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'tests' => 'required|array',
            'tests.*.id' => 'required|integer',
            'tests.*.test' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'tests.required' => 'El campo tests es obligatorio.',
            'tests.array' => 'El campo tests debe ser un array.',
            'tests.*.id.required' => 'El campo id es obligatorio para cada test.',
            'tests.*.id.integer' => 'Cada id debe ser un número entero.',
            'tests.*.test.required' => 'El campo test es obligatorio para cada test.',
            'tests.*.test.string' => 'El campo test debe ser una cadena de texto.',
        ];
    }
}
