<?php

namespace App\Traits;

trait GoogleCalendarTrait
{
  protected function create_calendar_body($nombre_psicologo, $fecha, $hora_inicio, $hora_final, $email_creador, $email_invitado, $anonimo = false)
  {
    $latitude = '-17.374720338667842';
    $longitude = '-66.15853372098734';
    $mapsLink = "https://www.google.com/maps/dir/?api=1&destination={$latitude}%2C{$longitude}";

    $psicotestLink = "https://neurall.cidtec-uc.com/calendar";

    $attendees = [
      [
        'email' => $email_creador,
        'responseStatus' => 'accepted'
      ]
    ];
    if (!$anonimo) {
      $attendees[] = [
        'email' => $email_invitado,
      ];
    }

    $body = [
      'summary' => 'Cita para el gabinete psicológico',
      'location' => 'Unifranz Cochabamba | Campus Portales | Bloque B | Insight Lab',
      'description' => 'Cita con ' . $nombre_psicologo . ' (psicólogo)' .
        "\n\nEn el Insight Lab de Unifranz Cochabamba, en la parte trasera del campus, frente a la cafetería, bloque B." .
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
      'attendees' => $attendees,
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
