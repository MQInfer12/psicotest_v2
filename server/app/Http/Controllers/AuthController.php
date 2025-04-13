<?php

namespace App\Http\Controllers;

use App\Http\Resources\U_userResource;
use App\Models\U_Rol;
use App\Models\U_user;
use App\Traits\ApiResponse;
use App\Traits\TimeTrait;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    use ApiResponse;
    use TimeTrait;

    public function login(Request $request)
    {
        $data = $request->validate([
            'code' => 'required',
            'redirect_uri' => 'required',
        ], [
            'code.required' => 'El token es requerido.',
            'redirect_uri.required' => 'El redirect_uri es requerido.',
        ]);

        $body = [
            'code' => $data['code'],
            'client_id' => env('GOOGLE_CLIENT_ID'),
            'client_secret' => env('GOOGLE_CLIENT_SECRET'),
            'redirect_uri' => $data['redirect_uri'],
            'grant_type' => 'authorization_code',
        ];

        $client = new Client();
        try {
            $response = $client->post('https://oauth2.googleapis.com/token', [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'json' => $body,
            ]);
            $event = json_decode($response->getBody()->getContents());

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $event->access_token,
            ])->get('https://www.googleapis.com/oauth2/v1/userinfo');
            if ($response->failed()) {
                return $this->unauthorizedResponse('Token inválido.');
            }

            $userInfo = $response->json();

            $defaultRol = U_Rol::where('por_defecto', true)->firstOrFail();

            $user = U_user::find($userInfo['email']);
            if ($user) {
                $user->update([
                    'foto' => $userInfo['picture'],
                    'access_token' => encrypt($event->access_token),
                    'refresh_token' => encrypt($event->refresh_token),
                ]);
            } else {
                $user = U_user::create([
                    'email' => $userInfo['email'],
                    'nombre' => $userInfo['name'],
                    'foto' => $userInfo['picture'],
                    'genero' => null,
                    'fecha_nacimiento' => null,
                    'estado' => true,
                    'id_rol' => $defaultRol->id,
                    'access_token' => encrypt($event->access_token),
                    'refresh_token' => encrypt($event->refresh_token),
                ]);
            }

            if ($user->estado === false) {
                return $this->unauthorizedResponse('El usuario se encuentra deshabilitado.');
            }

            Auth::login($user);
            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->successResponse("Inicio de sesión correcto.", [
                'user' => new U_userResource($user),
                'token' => $token
            ]);
        } catch (RequestException $e) {
            return $this->wrongResponse("Error al intentar obtener datos de inicio de sesión.");
        }
    }

    public function me(Request $request)
    {
        $initial = $request->query('initial') == "true";
        $user = $request->user();

        if ($initial) {
            $user->update([
                'ultima_conexion' => now(),
            ]);
        }

        return $this->successResponse("Usuario obtenido correctamente.", new U_userResource($request->user()));
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();
        $user->update([
            'access_token' => null,
            'refresh_token' => null,
        ]);
        return $this->successResponse("Cierre de sesión correcto.", null);
    }
}
