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
            'evento' => 'array|sometimes|nullable',
            'evento.nombre' => 'required_with:evento|string',
            'evento.fecha' => 'required_with:evento|string',
            'evento.hora' => 'required_with:evento|string',
            'evento.latitud' => 'required_with:evento|numeric',
            'evento.longitud' => 'required_with:evento|numeric',
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
            'evento.array' => 'El evento tiene que ser un objeto',
            'evento.nombre.string' => 'El nombre del evento tiene que ser una cadena',
            'evento.nombre.required' => 'El nombre del evento es requerido',
            'evento.fecha.string' => 'La fecha del evento tiene que ser una fecha',
            'evento.fecha.required' => 'La fecha del evento es requerida',
            'evento.hora.string' => 'La hora del evento tiene que ser una hora',
            'evento.hora.required' => 'La hora del evento es requerida',
            'evento.latitud.numeric' => 'La latitud del evento tiene que ser un número',
            'evento.latitud.required' => 'La latitud del evento es requerida',
            'evento.longitud.numeric' => 'La longitud del evento tiene que ser un número',
            'evento.longitud.required' => 'La longitud del evento es requerida',
        ];
    }

    protected function prepareForValidation()
    {
        if (is_string($this->evento)) {
            $evento = json_decode($this->evento, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->merge([
                    'evento' => $evento,
                ]);
            }
        }
    }
}
