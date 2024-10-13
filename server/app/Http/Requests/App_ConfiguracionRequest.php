<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class App_ConfiguracionRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'gpt_model' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'gpt_model.required' => 'El modelo GPT es requerido.',
        ];
    }
}
