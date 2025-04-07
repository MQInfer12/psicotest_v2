<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OpenAIController extends Controller
{
    public function stream(Request $request)
    {
        set_time_limit(0);

        $default_role = Storage::get('assets/default_role.txt');

        $apiKey = env('OPENAI_API_KEY');
        $model = $request->input('model', 'gpt-4o-mini');
        $role = $request->input('role', $default_role);
        $prompt = $request->input('prompt', "Hola, ¿podrías ayudarme?");
        $reasoning = $model === 'o3-mini';

        $client = new Client();

        $response = $client->request('POST', 'https://api.openai.com/v1/chat/completions', [
            'headers' => [
                'Authorization' => "Bearer {$apiKey}",
                'Content-Type' => 'application/json',
            ],
            'json' => array_filter([
                'model' => $model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => $role,
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ]
                ],
                'stream' => true,
                'temperature' => !$reasoning ? 0.4 : null,
                'max_tokens' => !$reasoning ? 2400 : null,
                'response_format' => ['type' => 'text'],
                'reasoning_effort' => $reasoning ? 'medium' : null,
            ]),
            'stream' => true,
        ]);

        return response()->stream(function () use ($response) {
            $body = $response->getBody();
            while (!$body->eof()) {
                echo $body->read(1024);
                flush();
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}
