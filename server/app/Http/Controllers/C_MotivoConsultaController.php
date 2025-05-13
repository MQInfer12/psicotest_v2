<?php

namespace App\Http\Controllers;

use App\Http\Requests\C_MotivoConsultaRequest;
use App\Http\Resources\C_MotivoConsultaResource;
use App\Models\C_MotivoConsulta;
use App\Traits\ApiResponse;

class C_MotivoConsultaController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $motivosConsulta = C_MotivoConsulta::all();
        return $this->successResponse(
            "Motivos obtenidos correctamente",
            C_MotivoConsultaResource::collection($motivosConsulta)
        );
    }

    public function store(C_MotivoConsultaRequest $request)
    {
        $validatedData = $request->validated();
        $descripcion = ucfirst(strtolower($validatedData['descripcion']));

        $existingMotivo = C_MotivoConsulta::where('descripcion', "ilike", $descripcion)->whereNull('deleted_at')->first();
        if ($existingMotivo) {
            return $this->wrongResponse("El motivo ya existe.");
        }

        $motivoConsulta = C_MotivoConsulta::create([
            "descripcion" => $descripcion
        ]);

        return $this->successResponse(
            "Motivo creado correctamente",
            new C_MotivoConsultaResource($motivoConsulta)
        );
    }

    public function update(C_MotivoConsultaRequest $request, int $id)
    {
        $motivoConsulta = C_MotivoConsulta::findOrFail($id);

        $validatedData = $request->validated();
        $descripcion = ucfirst(strtolower($validatedData['descripcion']));

        $existingMotivo = C_MotivoConsulta::where('id', '!=', $id)->where('descripcion', "ilike", $descripcion)->whereNull('deleted_at')->first();
        if ($existingMotivo) {
            return $this->wrongResponse("El motivo ya existe.");
        }

        $motivoConsulta->update([
            "descripcion" => $descripcion
        ]);

        return $this->successResponse(
            "Motivo actualizado correctamente",
            new C_MotivoConsultaResource($motivoConsulta)
        );
    }

    public function destroy(int $id)
    {
        $motivoConsulta = C_MotivoConsulta::findOrFail($id);
        $motivoConsulta->deleted_at = now();
        $motivoConsulta->save();
        return $this->successResponse(
            "Motivo eliminado correctamente",
            null
        );
    }
}
