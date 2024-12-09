<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class T_RespuestaMoveManyRequest extends FormRequest
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
            'id_carpeta' => 'required|integer|exists:t_carpetas,id'
        ];
    }

    public function messages()
    {
        return [
            'ids.required' => 'El parámetro ids es obligatorio.',    
            'ids.array' => 'El parámetro ids debe ser un array.',
            'ids.min' => 'El array ids debe contener al menos un elemento.',
            'ids.exists' => 'Algún valor en el array de ids no existe.',
            'ids.*.integer' => 'Cada valor en el array ids debe ser un número entero.',
            'id_carpeta.required' => 'La carpeta es obligatoria.',
            'id_carpeta.integer' => 'El parámetro id_carpeta tiene que ser un número entero.',
            'id_carpeta.exists' => 'La carpeta tiene que existir.'
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
