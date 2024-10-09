<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class T_RespuestaIndexForTableRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'folders' => 'nullable|array',
            'folders.*' => 'integer',
        ];
    }

    public function messages()
    {
        return [
            'folders.array' => 'El parámetro folders debe ser un array.',
            'folders.*.integer' => 'Cada valor en el array folders debe ser un número entero.',
        ];
    }

    protected function prepareForValidation()
    {
        if (is_string($this->folders)) {
            $folders = json_decode($this->folders, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($folders)) {
                $this->merge([
                    'folders' => array_map(function ($value) {
                        return is_numeric($value) ? (int) $value : $value;
                    }, $folders),
                ]);
            }
        }
    }
}
