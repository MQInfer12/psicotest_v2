<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class C_CitaIndexRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'access_token' => 'nullable|string',
            'previous' => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return [
            'access_token.string' => 'El access_token tiene que ser un string.',
            'previous.boolean' => 'El previous tiene que ser un boolean.',
        ];
    }

    protected function prepareForValidation()
    {
        if (is_string($this->previous)) {
            $this->merge([
                'previous' => filter_var($this->previous, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
    }
}
