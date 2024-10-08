<?php

namespace App\Http\Controllers;

use App\Http\Resources\U_userResource;
use App\Models\U_Rol;
use App\Models\U_user;
use App\Traits\ApiResponse;
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    use ApiResponse;

    public function login(Request $request)
    {

        $data = $request->validate([
            'token' => 'required',
        ], [
            'token.required' => 'El token es requerido.',
        ]);

        try {
            $jwks = Http::get('https://www.googleapis.com/oauth2/v3/certs')->json();
            $tokenData = JWT::decode($data['token'], JWK::parseKeySet($jwks));
            $tokenData = (array) $tokenData;
        } catch (\Exception $e) {
            return $this->notFoundResponse('Token inválido');
        }

        $user = U_user::where('email', $tokenData['email'])->first();
        $defaultRol = U_Rol::where('por_defecto', true)->firstOrFail();

        if ($user == null) {
            $user = U_user::create([
                'email' => $tokenData['email'],
                'nombre' => $tokenData['name'],
                'foto' => $tokenData['picture'],
                'genero' => null,
                'fecha_nacimiento' => null,
                'estado' => true,
                'id_rol' => $defaultRol->id
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
    }

    public function me(Request $request)
    {
        return $this->successResponse("Usuario obtenido correctamente.", new U_userResource($request->user()));
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return $this->successResponse("Cierre de sesión correcto.", null);
    }
}
