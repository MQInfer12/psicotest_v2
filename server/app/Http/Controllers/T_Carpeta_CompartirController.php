<?php

namespace App\Http\Controllers;

use App\Constants\Permisos;
use App\Http\Resources\T_Carpeta_CompartirResource;
use App\Models\T_Carpeta;
use App\Models\T_Carpeta_Compartir;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class T_Carpeta_CompartirController extends Controller
{
    use ApiResponse;

    public function shareFolder(Request $request, int $id_carpeta)
    {
        $user = $request->user();

        if (!in_array(Permisos::VER_RESULTADOS, $user->rol->permisos)) {
            return $this->wrongResponse('No tienes permisos para esto.');
        }

        $carpeta = T_Carpeta::where('id', $id_carpeta)->firstOrFail();
        if ($carpeta->email_user == $user->email) {
            return $this->wrongResponse("No puedes compartirte tu propia carpeta");
        }

        $compartido = T_Carpeta_Compartir::where('email_user', $user->email)->where('id_carpeta', $id_carpeta)->first();
        if (!$compartido) {
            $compartido = T_Carpeta_Compartir::create([
                "email_user" => $user->email,
                "id_carpeta" => $id_carpeta
            ]);
        }

        return $this->successResponse(
            "Carpeta compartida correctamente.",
            new T_Carpeta_CompartirResource($compartido)
        );
    }
}
