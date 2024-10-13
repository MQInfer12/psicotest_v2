<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class T_TestIndexForRespuestaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:t_respuestas,id',
        ];
    }

    public function messages()
    {
        return [
            'ids.array' => 'El parámetro ids debe ser un array.',
            'ids.min' => 'El parámetro ids debe contener al menos un valor.',
            'ids.*.integer' => 'Cada valor en el array ids debe ser un número entero.',
            'ids.*.exists' => 'Cada valor en el array ids debe existir en las respuestas.'
        ];
    }

    protected function prepareForValidation()
    {
        if (is_string($this->ids)) {
            $ids = json_decode($this->ids, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($ids)) {
                $this->merge([
                    'ids' => array_map(function ($value) {
                        return is_numeric($value) ? (int) $value : $value;
                    }, $ids),
                ]);
            }
        }
    }
}
