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
            'me' => 'sometimes|boolean',
        ];
    }

    public function messages()
    {
        return [
            'me.boolean' => 'El parámetro me debe ser verdadero o falso.',
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->has('me')) {
            $this->merge([
                'me' => filter_var($this->input('me'), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE),
            ]);
        }
    }
}
