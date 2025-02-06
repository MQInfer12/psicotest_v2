<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class B_BlogRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'titulo' => 'string|required',
            'descripcion' => 'string|nullable',
            'portada' => 'file|nullable|mimes:jpg,jpeg,png',
            'config' => 'string|required'
        ];
    }

    public function messages()
    {
        return [
            'titulo.required' => 'El título es requerido',
            'titulo.string' => 'El título tiene que ser una cadena',
            'descripcion.string' => 'La descripción tiene que ser una cadena',
            'portada.file' => 'La portada tiene que ser un archivo',
            'portada.mimes' => 'Los archivos válidos son JPG, JPEG o PNG',
            'config.required' => 'La configuración es requerida',
            'config.string' => 'La configuración tiene que ser una cadena',
        ];
    }

    protected function prepareForValidation() {}
}
