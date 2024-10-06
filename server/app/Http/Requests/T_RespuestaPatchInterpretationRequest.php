<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class T_RespuestaPatchInterpretationRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'interpretacion' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'interpretacion.required' => 'La interpretación es requerida.',
        ];
    }
}
