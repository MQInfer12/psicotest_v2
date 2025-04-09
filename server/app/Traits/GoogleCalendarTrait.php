<?php

namespace App\Traits;

trait GoogleCalendarTrait
{
  protected function create_calendar_body($nombre_psicologo, $fecha, $hora_inicio, $hora_final, $email_creador, $email_invitado)
  {
    $latitude = '-17.37516404213628';
    $longitude = '-66.15866852752312';
    $mapsLink = "https://www.google.com/maps/dir/?api=1&destination={$latitude}%2C{$longitude}";

    $psicotestLink = "https://neurall.cidtec-uc.com/calendar";

    $body = [
      'summary' => 'Cita para el gabinete psicológico',
      'location' => 'Unifranz Cochabamba | Gabinete Psicológico | 1er piso',
      'description' => 'Cita con ' . $nombre_psicologo . ' (psicólogo)' .
        "\n\nEn el gabinete psicológico de Unifranz Cochabamba, subiendo el primer piso por las escaleras a la derecha." .
        "\n<a href='{$mapsLink}'>Ver ubicación</a>" .
        "\n\nGenerado automáticamente por <a href='{$psicotestLink}'>Neurall</a>",
      'colorId' => '3',
      'start' => [
        'dateTime' => $fecha . 'T' . $hora_inicio,
        'timeZone' => 'America/La_Paz'
      ],
      'end' => [
        'dateTime' => $fecha . 'T' . $hora_final,
        'timeZone' => 'America/La_Paz'
      ],
      'attendees' => [
        [
          'email' => $email_creador,
          'responseStatus' => 'accepted'
        ],
        [
          'email' => $email_invitado,
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

    return $body;
  }
}
