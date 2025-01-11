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
            'previous' => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return [
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
