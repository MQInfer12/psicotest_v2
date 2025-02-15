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
            'portada' => 'file|nullable|mimes:jpg,jpeg,png|max:5120',
            'config' => 'string|required',
            'evento_nombre' => 'string|nullable',
            'evento_fecha' => 'string|nullable',
            'evento_hora' => 'string|nullable',
            'evento_latitud' => 'numeric|nullable',
            'evento_longitud' => 'numeric|nullable',
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
            'portada.max' => 'La portada no puede pesar más de 5MB',
            'config.required' => 'La configuración es requerida',
            'config.string' => 'La configuración tiene que ser una cadena',
            'evento_nombre.string' => 'El nombre del evento tiene que ser una cadena',
            'evento_fecha.string' => 'La fecha del evento tiene que ser una fecha',
            'evento_hora.string' => 'La hora del evento tiene que ser una hora',
            'evento_latitud.numeric' => 'La latitud del evento tiene que ser un número',
            'evento_longitud.numeric' => 'La longitud del evento tiene que ser un número',
        ];
    }

    protected function prepareForValidation() {}
}
