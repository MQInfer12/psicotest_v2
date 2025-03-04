<?php

namespace App\Traits;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

trait GoogleAPIs
{
  protected function sendGmail($recipient, $subject, $messageBody, $access_token, $user, $isHtml = false)
  {
    $client = new Client();

    $encodedSubject = "=?UTF-8?Q?" . quoted_printable_encode($subject) . "?=";
    if ($isHtml) {
        $contentType = "text/html";
        $contentEncoding = "quoted-printable";
    } else {
        $contentType = "text/plain";
        $contentEncoding = "quoted-printable";
    }
    $rawMessage = "From: <{$user->email}>\r\n";
    $rawMessage .= "To: <{$recipient}>\r\n";
    $rawMessage .= "Subject: {$encodedSubject}\r\n";
    $rawMessage .= "MIME-Version: 1.0\r\n";
    $rawMessage .= "Content-Type: {$contentType}; charset=UTF-8\r\n";
    $rawMessage .= "Content-Transfer-Encoding: {$contentEncoding}\r\n\r\n";
    $rawMessage .= quoted_printable_encode($messageBody);
    $rawMessage = base64_encode($rawMessage);
    $rawMessage = str_replace(['+', '/', '='], ['-', '_', ''], $rawMessage);

    try {
      $response = $client->post('https://www.googleapis.com/gmail/v1/users/me/messages/send', [
        'headers' => [
          'Authorization' => 'Bearer ' . $access_token,
          'Content-Type'  => 'application/json',
        ],
        'json' => [
          'raw' => $rawMessage,
        ],
      ]);
      return json_decode($response->getBody()->getContents(), true);
    } catch (RequestException $e) {
      if ($e->getResponse() && $e->getResponse()->getStatusCode() == 401) {
        $access_token = $this->refreshAccessToken($user);
        if ($access_token) {
          return $this->sendGmail($recipient, $subject, $messageBody, $access_token, $user);
        }
      }
    }

    return false;
  }

  protected function fetchGoogleCalendarEvent($id_calendar, $access_token, $user)
  {
    $client = new Client();
    try {
      $response = $client->get('https://www.googleapis.com/calendar/v3/calendars/primary/events/' . $id_calendar, [
        'headers' => [
          'Authorization' => 'Bearer ' . $access_token,
          'Content-Type' => 'application/json',
        ],
      ]);
      return json_decode($response->getBody()->getContents());
    } catch (RequestException $e) {
      if ($e->getResponse() && $e->getResponse()->getStatusCode() == 401) {
        $access_token = $this->refreshAccessToken($user);
        if ($access_token) {
          return $this->fetchGoogleCalendarEvent($id_calendar, $access_token, $user);
        }
      }
    }

    return false;
  }

  public function getAttendeeResponseStatus($id_calendar, $access_token, $user, $me = false)
  {
    $event = $this->fetchGoogleCalendarEvent($id_calendar, $access_token, $user);
    if (!$event) {
      return false;
    }
    foreach ($event->attendees as $attendee) {
      if ($me ? $attendee->email == $user->email : $attendee->email != $user->email) {
        return $attendee->responseStatus;
      }
    }
    return null;
  }

  public function updateGoogleCalendarEvent($id_calendar, $body, $access_token, $user)
  {
    $client = new Client();
    try {
      $client->patch('https://www.googleapis.com/calendar/v3/calendars/primary/events/' . $id_calendar, [
        'headers' => [
          'Authorization' => 'Bearer ' . $access_token,
          'Content-Type' => 'application/json',
        ],
        'json' => $body,
        'query' => [
          'sendUpdates' => 'all'
        ],
      ]);
      return true;
    } catch (RequestException $e) {
      if ($e->getResponse() && $e->getResponse()->getStatusCode() == 401) {
        $access_token = $this->refreshAccessToken($user);
        if ($access_token) {
          return $this->updateGoogleCalendarEvent($id_calendar, $body, $access_token, $user);
        }
      }
    }

    return false;
  }

  public function createGoogleCalendarEvent($body, $access_token, $user)
  {
    $client = new Client();
    try {
      $response = $client->post('https://www.googleapis.com/calendar/v3/calendars/primary/events', [
        'headers' => [
          'Authorization' => 'Bearer ' . $access_token,
          'Content-Type' => 'application/json',
        ],
        'json' => $body,
        'query' => [
          'sendUpdates' => 'all'
        ],
      ]);
      return json_decode($response->getBody()->getContents());
    } catch (RequestException $e) {
      if ($e->getResponse() && $e->getResponse()->getStatusCode() == 401) {
        $access_token = $this->refreshAccessToken($user);
        if ($access_token) {
          return $this->createGoogleCalendarEvent($body, $access_token, $user);
        }
      }
      return false;
    }
  }

  public function deleteGoogleCalendarEvent($id_calendar, $access_token, $user)
  {
    $client = new Client();

    try {
      $client->delete('https://www.googleapis.com/calendar/v3/calendars/primary/events/' . $id_calendar, [
        'headers' => [
          'Authorization' => 'Bearer ' . $access_token,
          'Content-Type' => 'application/json',
        ],
      ]);
      return true;
    } catch (RequestException $e) {
      if ($e->getResponse() && $e->getResponse()->getStatusCode() == 401) {
        $access_token = $this->refreshAccessToken($user);
        if ($access_token) {
          return $this->deleteGoogleCalendarEvent($id_calendar, $access_token, $user);
        }
      }
      return false;
    }
  }

  private function refreshAccessToken($user)
  {
    try {
      $client = new Client();
      $response = $client->post('https://oauth2.googleapis.com/token', [
        'form_params' => [
          'grant_type' => 'refresh_token',
          'refresh_token' => $user->raw_refresh_token(),
          'client_id' => env('GOOGLE_CLIENT_ID'),
          'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        ],
      ]);
      $data = json_decode($response->getBody()->getContents(), true);
      $user->update(['access_token' => encrypt($data['access_token'])]);
      return $data['access_token'];
    } catch (RequestException $e) {
      return null;
    }
  }
}
