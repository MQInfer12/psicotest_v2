<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IA_PlantillaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nombre' => 'string|required',
            'descripcion' => 'string|required',
            'plantilla' => 'string|required',
            'contexto' => 'string|nullable',
            'idTests' => 'array|required|min:2',
            'idTests.*' => 'integer|exists:t_tests,id',
        ];
    }

    public function messages()
    {
        return [
            'nombre.string' => 'El nombre tiene que ser una cadena',
            'nombre.required' => 'El nombre es requerido',
            'descripcion.string' => 'La descripción tiene que ser una cadena',
            'descripcion.required' => 'La descripción es requerida',
            'plantilla.required' => 'La configuración de la plantilla es requerida',
            'plantilla.string' => 'La configuración de la plantilla tiene que ser una cadena',
            'contexto.string' => 'El contexto tiene que ser una cadena',
            'idTests.array' => 'Los tests tienen que ser un arreglo',
            'idTests.min' => 'Se requieren al menos 2 tests',
            'idTests.*.integer' => 'Los tests tienen que ser enteros',
            'idTests.*.exists' => 'Uno o más tests no existen',
        ];
    }

    protected function prepareForValidation() {}
}
