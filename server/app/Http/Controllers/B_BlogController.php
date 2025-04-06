<?php

namespace App\Http\Controllers;

use App\Constants\Permisos;
use App\Http\Requests\B_BlogRequest;
use App\Http\Resources\B_BlogResource;
use App\Models\B_Asistencia;
use App\Models\B_Blog;
use App\Models\B_Evento;
use App\Traits\ApiResponse;
use App\Traits\GoogleAPIs;
use App\Traits\PermisosTrait;
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class B_BlogController extends Controller
{
    use ApiResponse;
    use GoogleAPIs;
    use PermisosTrait;

    public function index()
    {
        $blogs = B_Blog::orderBy('id', 'desc')->get();
        return $this->successResponse(
            "Blogs obtenidos correctamente.",
            B_BlogResource::collection($blogs)
        );
    }

    public function show(int $id)
    {
        $blog = B_Blog::findOrFail($id);

        $count = request()->query('count') == 'true';
        if ($count) {
            $blog->visitas++;
            $blog->save();
        }

        return $this->successResponse(
            "Blog obtenido correctamente.",
            new B_BlogResource($blog)
        );
    }

    public function indexForMe(Request $request)
    {
        $blogs = B_Blog::orderBy('id', 'desc')->where('email_autor', $request->user()->email)->get();
        return $this->successResponse(
            "Blogs obtenidos correctamente.",
            B_BlogResource::collection($blogs)
        );
    }

    public function store(B_BlogRequest $request)
    {
        $user = $request->user();
        $validatedData = $request->validated();

        $route = $validatedData['portada']->store('public/info/src');
        $route = str_replace('public/', '/', $route);

        $config = json_decode($validatedData['config']);
        foreach ($config as $item) {
            if ($item->type == 'image') {
                $file = $request[$item->id];
                $imageRoute = $file->storeAs('public/info/static', $item->id . '.png');
                $item->src = str_replace('public/', '/', $imageRoute);
            }
            if ($item->type == 'pdf') {
                $file = $request[$item->id];
                $imageRoute = $file->storeAs('public/info/pdf', $item->id . '.pdf');
                $item->src = str_replace('public/', '/', $imageRoute);
            }
        }

        $blog = B_Blog::create([
            'titulo' => $validatedData['titulo'],
            'descripcion' => $validatedData['descripcion'],
            'portada' => $route,
            'email_autor' => $user->email,
            'config' => json_encode($config)
        ]);

        $bodyHasEvent = $validatedData['evento'] ?? null;
        if ($bodyHasEvent) {
            $user = $request->user();
            $access_token = $request->user()->raw_access_token();
            if (!$access_token) {
                return $this->wrongResponse("El token de acceso es inválido.");
            }

            $lat = $validatedData['evento']['latitud'];
            $lng = $validatedData['evento']['longitud'];
            $urlReverse = "https://nominatim.openstreetmap.org/reverse?format=json&lat={$lat}&lon={$lng}";
            $client = new Client([
                'headers' => [
                    'User-Agent' => 'Neurall/v3 (psicologiaunifranz@gmail.com)'
                ]
            ]);
            $response = $client->get($urlReverse);
            $response = json_decode($response->getBody()->getContents());
            $direccion = $response->name != "" ? $response->name : ($response->display_name != "" ? $response->display_name . " (automático)" : "Ubicación desconocida");

            $mapsLink = "https://www.google.com/maps/dir/?api=1&destination={$lat}%2C{$lng}";
            $psicotestLink = "https://psicotest.cidtec-uc.com/daily/{$blog->id}";

            $datetime = date('c', strtotime($validatedData['evento']['fecha'] . ' ' . $validatedData['evento']['hora'] . ' +4 hours'));
            $datetimeEnd = date('c', strtotime($validatedData['evento']['fecha'] . ' ' . $validatedData['evento']['hora'] . ' +5 hours'));

            $body = [
                'summary' => $validatedData['evento']['nombre'],
                'location' => $direccion,
                'description' => 'Evento de psicología' .
                    "\n\n" . $validatedData['titulo'] . " | " . $validatedData['evento']['nombre'] .
                    "\n<a href='{$mapsLink}'>Ver ubicación</a>" .
                    "\n\nGenerado automáticamente por <a href='{$psicotestLink}'>Neurall</a>",
                'colorId' => '3',
                'visibility' => 'public',
                'start' => [
                    'dateTime' => $datetime,
                    'timeZone' => 'America/La_Paz'
                ],
                'end' => [
                    'dateTime' => $datetimeEnd,
                    'timeZone' => 'America/La_Paz'
                ],
                'attendees' => [
                    [
                        'email' => $user->email,
                        'responseStatus' => 'accepted'
                    ]
                ],
                'reminders' => [
                    'useDefault' => false,
                    'overrides' => [
                        [
                            'method' => 'popup',
                            'minutes' => 60
                        ],
                        [
                            'method' => 'popup',
                            'minutes' => 30
                        ]
                    ]
                ]
            ];
            $event = $this->createGoogleCalendarEvent($body, $access_token, $user);
            if (!$event) {
                return $this->wrongResponse("Error al crear el evento del blog.");
            }

            $evento = B_Evento::create([
                'id_blog' => $blog->id,
                'nombre' => $validatedData['evento']['nombre'],
                'fecha' => $datetime,
                'latitud' => $validatedData['evento']['latitud'],
                'longitud' => $validatedData['evento']['longitud'],
                'direccion' => $direccion
            ]);

            B_Asistencia::create([
                "email_user" => $user->email,
                "id_evento" => $evento->id,
                'id_calendar' => $event->id,
                'link_calendar' => $event->htmlLink
            ]);
        }

        return $this->successResponse(
            "Blog creado correctamente.",
            new B_BlogResource($blog)
        );
    }

    public function update(B_BlogRequest $request, int $id)
    {
        $validatedData = $request->validated();

        $user = $request->user();
        $blog = B_Blog::findOrFail($id);

        if ($user->email != $blog->email_autor) {
            return $this->wrongResponse("No tienes permisos para editar este blog.");
        }

        $portada = $validatedData['portada'] ?? null;
        if ($portada) {
            $oldRoute = 'storage' . $blog->portada;
            if (file_exists($oldRoute)) {
                unlink($oldRoute);
            }
            $route = $portada->store('public/info/src');
            $portada = str_replace('public/', '/', $route);
        } else {
            $portada = $blog->portada;
        }

        $oldConfig = json_decode($blog->config);
        $config = json_decode($validatedData['config']);

        //BORRAR IMAGENES ANTIGUAS QUE YA NO ESTÉN EN LA NUEVA CONFIGURACIÓN
        foreach ($oldConfig as $oldItem) {
            if (($oldItem->type == 'image' || $oldItem->type == 'pdf') && !collect($config)->contains('id', $oldItem->id)) {
                $route = 'storage' . $oldItem->src;
                if (file_exists($route)) {
                    unlink($route);
                }
            }
        }

        //GUARDAR NUEVAS IMÁGENES
        foreach ($config as $item) {
            if ($item->type == 'image') {
                $file = $request[$item->id];
                if ($file) {
                    $imageRoute = $file->storeAs('public/info/static', $item->id . '.png');
                    $item->src = str_replace('public/', '/', $imageRoute);
                }
            }
            if ($item->type == 'pdf') {
                $file = $request[$item->id];
                if ($file) {
                    $imageRoute = $file->storeAs('public/info/pdf', $item->id . '.pdf');
                    $item->src = str_replace('public/', '/', $imageRoute);
                }
            }
        }

        $blog->update([
            'titulo' => $validatedData['titulo'],
            'descripcion' => $validatedData['descripcion'],
            'portada' => $portada,
            'config' => json_encode($config)
        ]);

        $alreadyHasEvent = $blog->evento;
        $bodyHasEvent = $validatedData['evento'] ?? null;

        $user = $request->user();
        $access_token = $request->user()->raw_access_token();
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        if ($bodyHasEvent) {
            $lat = $validatedData['evento']['latitud'];
            $lng = $validatedData['evento']['longitud'];
            $urlReverse = "https://nominatim.openstreetmap.org/reverse?format=json&lat={$lat}&lon={$lng}";
            $client = new Client([
                'headers' => [
                    'User-Agent' => 'Neurall/v3 (psicologiaunifranz@gmail.com)'
                ]
            ]);
            $response = $client->get($urlReverse);
            $response = json_decode($response->getBody()->getContents());
            $direccion = $response->name != "" ? $response->name : ($response->display_name != "" ? $response->display_name . " (automático)" : "Ubicación desconocida");

            $mapsLink = "https://www.google.com/maps/dir/?api=1&destination={$lat}%2C{$lng}";
            $psicotestLink = "https://psicotest.cidtec-uc.com/daily/{$blog->id}";

            $datetime = date('c', strtotime($validatedData['evento']['fecha'] . ' ' . $validatedData['evento']['hora'] . ' +4 hours'));
            $datetimeEnd = date('c', strtotime($validatedData['evento']['fecha'] . ' ' . $validatedData['evento']['hora'] . ' +5 hours'));

            if (!!$alreadyHasEvent) {
                $asistencia = B_Asistencia::where('email_user', $user->email)->where('id_evento', $alreadyHasEvent->id)->first();
                if (!!$asistencia) {
                    $body = [
                        'summary' => $validatedData['evento']['nombre'],
                        'location' => $direccion,
                        'description' => 'Evento de psicología' .
                            "\n\n" . $validatedData['titulo'] . " | " . $validatedData['evento']['nombre'] .
                            "\n<a href='{$mapsLink}'>Ver ubicación</a>" .
                            "\n\nGenerado automáticamente por <a href='{$psicotestLink}'>Neurall</a>",
                        'start' => [
                            'dateTime' => $datetime,
                            'timeZone' => 'America/La_Paz'
                        ],
                        'end' => [
                            'dateTime' => $datetimeEnd,
                            'timeZone' => 'America/La_Paz'
                        ]
                    ];

                    $event = $this->updateGoogleCalendarEvent($asistencia->id_calendar, $body, $access_token, $user);
                    if (!$event) {
                        return $this->wrongResponse("Error al crear el evento del blog.");
                    }

                    $alreadyHasEvent->update([
                        'nombre' => $validatedData['evento']['nombre'],
                        'fecha' => $datetime,
                        'latitud' => $validatedData['evento']['latitud'],
                        'longitud' => $validatedData['evento']['longitud'],
                        'direccion' => $direccion
                    ]);
                }
            } else {
                $body = [
                    'summary' => $validatedData['evento']['nombre'],
                    'location' => $direccion,
                    'description' => 'Evento de psicología' .
                        "\n\n" . $validatedData['titulo'] . " | " . $validatedData['evento']['nombre'] .
                        "\n<a href='{$mapsLink}'>Ver ubicación</a>" .
                        "\n\nGenerado automáticamente por <a href='{$psicotestLink}'>Neurall</a>",
                    'colorId' => '3',
                    'start' => [
                        'dateTime' => $datetime,
                        'timeZone' => 'America/La_Paz'
                    ],
                    'end' => [
                        'dateTime' => $datetimeEnd,
                        'timeZone' => 'America/La_Paz'
                    ],
                    'attendees' => [
                        [
                            'email' => $user->email,
                            'responseStatus' => 'accepted'
                        ]
                    ],
                    'reminders' => [
                        'useDefault' => false,
                        'overrides' => [
                            [
                                'method' => 'popup',
                                'minutes' => 60
                            ],
                            [
                                'method' => 'popup',
                                'minutes' => 30
                            ]
                        ]
                    ]
                ];
                $event = $this->createGoogleCalendarEvent($body, $access_token, $user);
                if (!$event) {
                    return $this->wrongResponse("Error al crear el evento del blog.");
                }

                $evento = B_Evento::create([
                    'id_blog' => $blog->id,
                    'nombre' => $validatedData['evento']['nombre'],
                    'fecha' => $datetime,
                    'latitud' => $validatedData['evento']['latitud'],
                    'longitud' => $validatedData['evento']['longitud'],
                    'direccion' => $direccion
                ]);

                B_Asistencia::create([
                    "email_user" => $user->email,
                    "id_evento" => $evento->id,
                    'id_calendar' => $event->id,
                    'link_calendar' => $event->htmlLink
                ]);
            }
        } else if (!!$alreadyHasEvent) {
            $asistencia = B_Asistencia::where('email_user', $user->email)->where('id_evento', $alreadyHasEvent->id)->first();
            if ($asistencia) {
                $this->deleteGoogleCalendarEvent($asistencia->id_calendar, $access_token, $user);
            }
            $alreadyHasEvent->delete();
        }

        return $this->successResponse(
            "Blog actualizado correctamente.",
            new B_BlogResource($blog)
        );
    }

    public function attendToggle(Request $request, int $id)
    {
        $blog = B_Blog::findOrFail($id);
        $oldEvento = $blog->evento;
        if (!$oldEvento) {
            return $this->wrongResponse("Este blog no tiene un evento asociado.");
        }

        $user = $request->user();
        $asistencia = B_Asistencia::where('email_user', $user->email)->where('id_evento', $oldEvento->id)->first();
        $access_token = $request->user()->raw_access_token();
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        if ($asistencia) {
            $result = $this->deleteGoogleCalendarEvent($asistencia->id_calendar, $access_token, $user);
            $asistencia->delete();
            return $this->successResponse(
                "Ya no asistirás al evento.",
                new B_BlogResource($blog)
            );
        } else {
            $lat = $oldEvento->latitud;
            $lng = $oldEvento->longitud;
            $urlReverse = "https://nominatim.openstreetmap.org/reverse?format=json&lat={$lat}&lon={$lng}";
            $client = new Client([
                'headers' => [
                    'User-Agent' => 'Neurall/v3 (psicologiaunifranz@gmail.com)'
                ]
            ]);
            $response = $client->get($urlReverse);
            $response = json_decode($response->getBody()->getContents());
            $name = $response->name != "" ? $response->name : ($response->display_name != "" ? $response->display_name . " (automático)" : "Ubicación desconocida");

            $mapsLink = "https://www.google.com/maps/dir/?api=1&destination={$lat}%2C{$lng}";
            $psicotestLink = "https://psicotest.cidtec-uc.com/daily/{$blog->id}";

            $datetime = date('c', strtotime($oldEvento->fecha . ' ' . $oldEvento->hora));
            $datetimeEnd = date('c', strtotime($oldEvento->fecha . ' ' . $oldEvento->hora));

            $body = [
                'summary' => $oldEvento->nombre,
                'location' => $name,
                'description' => 'Evento de psicología' .
                    "\n\n" . $blog->titulo . " | " . $oldEvento->nombre .
                    "\n<a href='{$mapsLink}'>Ver ubicación</a>" .
                    "\n\nGenerado automáticamente por <a href='{$psicotestLink}'>Neurall</a>",
                'colorId' => '3',
                'visibility' => 'public',
                'start' => [
                    'dateTime' => $datetime,
                    'timeZone' => 'America/La_Paz'
                ],
                'end' => [
                    'dateTime' => $datetimeEnd,
                    'timeZone' => 'America/La_Paz'
                ],
                'attendees' => [
                    [
                        'email' => $user->email,
                        'responseStatus' => 'accepted'
                    ]
                ],
                'reminders' => [
                    'useDefault' => false,
                    'overrides' => [
                        [
                            'method' => 'popup',
                            'minutes' => 60
                        ],
                        [
                            'method' => 'popup',
                            'minutes' => 30
                        ]
                    ]
                ]
            ];

            $event = $this->createGoogleCalendarEvent($body, $access_token, $user);
            if (!$event) {
                return $this->wrongResponse("Error al crear la asistencia.");
            }

            B_Asistencia::create([
                'email_user' => $user->email,
                'id_evento' => $oldEvento->id,
                'id_calendar' => $event->id,
                'link_calendar' => $event->htmlLink
            ]);

            return $this->successResponse(
                "Se agregó el evento a tu calendario correctamente.",
                new B_BlogResource($blog)
            );
        }
    }

    public function standOut(Request $request, int $id)
    {
        $user = $request->user();
        if (!$this->tienePermiso($user, Permisos::DESTACAR_BLOGS)) {
            return $this->wrongResponse('No tienes permisos para destacar blogs.');
        }

        $blog = B_Blog::findOrFail($id);
        if ($blog->destacado) {
            $blog->update([
                'destacado' => false
            ]);
        } else {
            B_Blog::where('destacado', true)->update([
                'destacado' => false
            ]);
            $blog->update([
                'destacado' => true
            ]);
        }

        return $this->successResponse(
            "Blog destacado correctamente.",
            new B_BlogResource($blog)
        );
    }

    public function destroy(Request $request, int $id)
    {
        $user = $request->user();
        $blog = B_Blog::findOrFail($id);

        if ($user->email != $blog->email_autor && !$this->tienePermiso($user, Permisos::DESTACAR_BLOGS)) {
            return $this->wrongResponse("No tienes permisos para eliminar este blog.");
        }

        $route = 'storage' . $blog->portada;
        if (file_exists($route)) {
            unlink($route);
        }

        $config = json_decode($blog->config);
        foreach ($config as $item) {
            if ($item->type == 'image' || $item->type == 'pdf') {
                $route = 'storage' . $item->src;
                if (file_exists($route)) {
                    unlink($route);
                }
            }
        }

        $oldEvent = $blog->evento;
        if (!!$oldEvent) {
            $asistencia = B_Asistencia::where('email_user', $user->email)->where('id_evento', $oldEvent->id)->first();
            if ($asistencia) {
                $access_token = $user->raw_access_token();
                if (!$access_token) {
                    return $this->wrongResponse("El token de acceso es inválido.");
                }
                $this->deleteGoogleCalendarEvent($asistencia->id_calendar, $user->raw_access_token(), $user);
            }
        }

        $blog->delete();
        return $this->successResponse("Blog eliminado correctamente.", null);
    }
}
