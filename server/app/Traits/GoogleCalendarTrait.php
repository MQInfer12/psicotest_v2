<?php

namespace App\Traits;

trait GoogleCalendarTrait
{
  protected function create_calendar_body($nombre_psicologo, $fecha, $hora_inicio, $hora_final, $email_creador, $email_invitado, $tipo = "Presencial", $anonimo = false)
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

    $tipo_text = $tipo === "Presencial" ? "\n\nEn el Insight Lab de Unifranz Cochabamba (sede Portales), en la parte trasera del campus, frente a la cafetería, bloque C.\n\n<a href='{$mapsLink}'>Ver ubicación</a>" : "\n\nEsta es una cita virtual.\n\nEl enlace para unirse a la sesión será proporcionado por el psicólogo mediante correo electrónico o Whatsapp.";

    $body = [
      'summary' => 'Cita para el gabinete psicológico',
      'location' => 'Unifranz Cochabamba | Campus Portales | Bloque B | Insight Lab',
      'description' => 'Cita con ' . $nombre_psicologo . ' (psicólogo)' .
        $tipo_text .
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
