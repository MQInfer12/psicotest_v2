<?php

namespace App\Http\Controllers;

use App\Constants\Permisos;
use App\Http\Requests\IA_PlantillaRequest;
use App\Http\Resources\IA_PlantillaResource;
use App\Models\IA_Plantilla;
use App\Models\IA_Test_Plantilla;
use App\Traits\ApiResponse;
use App\Traits\PermisosTrait;
use Illuminate\Http\Request;

class IA_PlantillaController extends Controller
{
    use ApiResponse;
    use PermisosTrait;

    public function index()
    {
        $plantillas = IA_Plantilla::all();
        return $this->successResponse(
            "Usuarios obtenidos correctamente.",
            IA_PlantillaResource::collection($plantillas)
        );
    }

    public function show(int $id)
    {
        $plantilla = IA_Plantilla::findOrFail($id);
        return $this->successResponse(
            "Plantilla obtenida correctamente.",
            new IA_PlantillaResource($plantilla)
        );
    }

    public function store(IA_PlantillaRequest $request)
    {
        $validatedData = $request->validated();

        $plantilla = IA_Plantilla::create([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'],
            'plantilla' => $validatedData['plantilla'],
            'contexto' => $validatedData['contexto']
        ]);

        foreach ($validatedData['idTests'] as $idTest) {
            IA_Test_Plantilla::create([
                'id_test' => $idTest,
                'id_plantilla' => $plantilla->id
            ]);
        }

        return $this->successResponse(
            "Plantilla creada correctamente.",
            new IA_PlantillaResource($plantilla)
        );
    }

    public function update(IA_PlantillaRequest $request, int $id)
    {
        $validatedData = $request->validated();
        $plantilla = IA_Plantilla::findOrFail($id);

        $plantilla->update([
            'nombre' => $validatedData['nombre'],
            'descripcion' => $validatedData['descripcion'],
            'plantilla' => $validatedData['plantilla'],
            'contexto' => $validatedData['contexto']
        ]);

        IA_Test_Plantilla::where('id_plantilla', $plantilla->id)->delete();
        foreach ($validatedData['idTests'] as $idTest) {
            IA_Test_Plantilla::create([
                'id_test' => $idTest,
                'id_plantilla' => $plantilla->id
            ]);
        }

        return $this->successResponse(
            "Plantilla actualizada correctamente.",
            new IA_PlantillaResource($plantilla)
        );
    }

    public function destroy(Request $request, int $id)
    {
        $user = $request->user();
        $plantilla = IA_Plantilla::findOrFail($id);

        if (!$this->tienePermiso($user, Permisos::VER_PLANTILLAS)) {
            return $this->wrongResponse("No tienes permisos para eliminar esta plantilla.");
        }

        $plantilla->delete();
        return $this->successResponse("Plantilla eliminada correctamente.", null);
    }
}
