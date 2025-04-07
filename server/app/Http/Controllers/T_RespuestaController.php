<?php

namespace App\Http\Controllers;

use App\Constants\Permisos;
use App\Http\Requests\T_RespuestaIdsRequest;
use App\Http\Requests\T_RespuestaIndexForTableRequest;
use App\Http\Requests\T_RespuestaMoveManyRequest;
use App\Http\Requests\T_RespuestaPatchInterpretationRequest;
use App\Http\Requests\T_RespuestaPatchInterpretationsRequest;
use App\Http\Requests\T_RespuestaPatchVisibilidadRequest;
use App\Http\Requests\T_RespuestaStoreRequest;
use App\Http\Requests\T_RespuestaUpdateRequest;
use App\Http\Resources\T_Test_RespuestaResource;
use App\Http\Resources\T_Tests_RepuestaResource;
use App\Models\T_Respuesta;
use App\Models\T_Test;
use App\Models\U_user;
use App\Traits\ApiResponse;
use App\Traits\GoogleAPIs;
use App\Traits\PermisosTrait;
use Illuminate\Http\Request;

class T_RespuestaController extends Controller
{
    use ApiResponse;
    use GoogleAPIs;
    use PermisosTrait;

    public function index()
    {
        //? AL VER LA TABLA DE RESULTADOS
    }

    public function indexForResolve(Request $request)
    {
        $user = $request->user();
        return $this->successResponse(
            "Tests obtenidos correctamente.",
            T_Tests_RepuestaResource::collection($user->respuestas)
        );
    }

    public function indexForTable(T_RespuestaIndexForTableRequest $request)
    {
        $folders = $request->input('folders', []);
        if (empty($folders)) {
            return $this->successResponse("Tests obtenidos correctamente.", []);
        }

        $user = $request->user();
        $availableFolders = $user->carpetasTotales()->pluck('id')->toArray();
        $availableFolders[] = 0;

        $folders = array_intersect($folders, $availableFolders);

        $respuestas = T_Respuesta::when(in_array(0, $folders), function ($query) use ($folders, $user) {
            return $query->where(function ($query) use ($folders, $user) {
                $query->whereIn('id_carpeta', array_diff($folders, [0]))
                    ->orWhere(function ($query) use ($user) {
                        $query->whereNull('id_carpeta')
                            ->where('email_asignador', $user->email);
                    });
            });
        }, function ($query) use ($folders) {
            return $query->whereIn('id_carpeta', $folders);
        })
            ->orderBy('id', 'asc')
            ->get();

        return $this->successResponse(
            "Tests obtenidos correctamente.",
            T_Tests_RepuestaResource::collection($respuestas)
        );
    }

    public function store(T_RespuestaStoreRequest $request)
    {
        //? AL INGRESAR AL LINK DEL QR
        $validatedData = $request->validated();

        $user = $request->user();

        $email_asignador = $validatedData['email_asignador'];
        $email_user = $user->email;
        if ($email_user == $email_asignador) {
            return $this->wrongResponse('No te puedes asignar un test a ti mismo.');
        }

        $asignador = U_user::findOrFail($email_asignador);
        if (!$this->tienePermiso($asignador, Permisos::COMPARTIR_TEST)) {
            return $this->wrongResponse('Esta persona no tiene permisos para compartir tests.');
        }

        $testIds = $validatedData['id_test'];
        $responses = [];

        foreach ($testIds as $testId) {
            $test = T_Test::findOrFail($testId);
            $id_test_version = $test->latest_version->id;

            $exist = T_Respuesta::where('id_test_version', $id_test_version)
                ->where('email_user', $email_user)
                ->where('email_asignador', $email_asignador)
                ->first();

            if ($exist) {
                if ($exist->estado == "Pendiente") {
                    $responses[] = $exist->id;
                }
                continue;
            }

            $respuesta = T_Respuesta::create([
                "id_test_version" => $id_test_version,
                "email_user" => $email_user,
                "email_asignador" => $email_asignador,
                "estado" => "Pendiente",
                "fecha_asignado" => now(),
                "id_carpeta" => $validatedData['id_carpeta'] ?? null
            ]);

            $responses[] = $respuesta->id;
        }

        return $this->successResponse(
            "Tests asignados correctamente.",
            $responses
        );
    }

    public function show(T_Respuesta $t_Respuesta)
    {
        //? PARA CARGAR EL TEST
    }

    public function update(T_RespuestaUpdateRequest $request, int $id)
    {
        //? AL MOMENTO DE ENVIAR EL TEST
        $validatedData = $request->validated();

        $respuesta = T_Respuesta::findOrFail($id);

        $respuesta->update([
            "resultados" => $validatedData['resultados'],
            "estado" => "Enviado",
        ]);

        if ($validatedData['tiempo'] ?? null) {
            $respuesta->update([
                "fecha_enviado" => now(),
                "tiempo" => $validatedData['tiempo']
            ]);
        }

        return $this->successResponse(
            "Test enviado correctamente.",
            new T_Tests_RepuestaResource($respuesta)
        );
    }

    public function patchInterpretation(T_RespuestaPatchInterpretationRequest $request, int $id)
    {
        $validatedData = $request->validated();
        $respuesta = T_Respuesta::findOrFail($id);
        $respuesta->update([
            "interpretacion" => $validatedData['interpretacion'],
        ]);
        return $this->successResponse(
            "Interpretación guardada correctamente.",
            new T_Test_RespuestaResource($respuesta)
        );
    }

    public function patchInterpretations(T_RespuestaPatchInterpretationsRequest $request)
    {
        $validatedData = $request->validated();
        $respuestas = [];
        foreach ($validatedData['interpretaciones'] as $interpretacion) {
            $respuesta = T_Respuesta::findOrFail($interpretacion['id']);
            $respuesta->update([
                "interpretacion" => $interpretacion['interpretacion'],
            ]);
            $respuestas[] = $respuesta;
        }
        return $this->successResponse(
            "Interpretaciones guardadas correctamente.",
            T_Tests_RepuestaResource::collection($respuestas)
        );
    }

    public function patchVisibilidad(T_RespuestaPatchVisibilidadRequest $request)
    {
        $user = $request->user();
        $access_token = $request->user()->raw_access_token();
        if (!$access_token) {
            return $this->wrongResponse("El token de acceso es inválido.");
        }

        $respuestas = T_Respuesta::whereIn('id', $request->input('ids'))->get();
        $first = $respuestas->first();

        $psicotestLink = "https://neurall.cidtec-uc.com/download/{$first->id}";
        $messageBody = "<p>¡Hola, espero que estés teniendo un gran día!</p>"
            . '<p>Desde <span style="font-weight:bold">Neurall</span> Me comunico contigo para informarte que ya tenemos listo el resultado de tu prueba '
            . "psicológica realizada en nuestra plataforma.</p>"
            . "<p>Para descargar tus resultados, ingresa al enlace que te proporcionamos e inicia sesión con tu cuenta.</p>"
            . '<p>¡Gracias por confiar en nosotros, esperamos verte pronto en <span style="font-weight:bold">Unifranz</span>! 🧡🖤</p>'
            . "<a href='{$psicotestLink}' target='_blank'>¡Haz clic aquí para ver tus resultados!</a>";

        $result = $this->sendGmail(
            $first->email_user,
            'Resultado de la prueba psicológica',
            $messageBody,
            $access_token,
            $user,
            true
        );
        if (!$result) {
            return $this->wrongResponse("No se pudo enviar la respuesta.");
        }

        foreach ($respuestas as $respuesta) {
            $respuesta->update([
                "fecha_visible" => now()
            ]);
        }

        return $this->successResponse(
            "Respuesta enviada al correo del evaluado correctamente.",
            T_Tests_RepuestaResource::collection($respuestas)
        );
    }

    public function moveMany(T_RespuestaMoveManyRequest $request)
    {
        $validatedData = $request->validated();
        T_Respuesta::whereIn('id', $validatedData['ids'])->update(['id_carpeta' => $validatedData['id_carpeta']]);
        return $this->successResponse(
            "Las respuestas se movieron a la carpeta correspondiente.",
            null
        );
    }

    public function destroyMany(T_RespuestaIdsRequest $request)
    {
        $validatedData = $request->validated();
        $deletedCount = T_Respuesta::whereIn('id', $validatedData['ids'])->delete();
        return $this->successResponse(
            "Respuestas eliminadas correctamente.",
            $deletedCount
        );
    }
}
