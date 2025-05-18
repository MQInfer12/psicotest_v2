<?php

namespace App\Http\Controllers;

use App\Http\Requests\C_NotaRequest;
use App\Http\Resources\C_NotaResource;
use App\Models\C_Nota;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class C_NotaController extends Controller
{
    use ApiResponse;

    public function store(C_NotaRequest $request)
    {
        $validatedData = $request->validated();
        $psicologo = $request->user();

        $nota = C_Nota::create([
            'email_psicologo' => $psicologo->email,
            'descripcion' => $validatedData['descripcion'],
            'id_caso' => $validatedData['id_caso'] ?? null,
            'id_cita' => $validatedData['id_cita'] ?? null,
        ]);

        return $this->successResponse("Nota creada correctamente", new C_NotaResource($nota));
    }

    public function update(C_NotaRequest $request, int $id)
    {
        $validatedData = $request->validated();
        $nota = C_Nota::findOrFail($id);

        $psicologo = $request->user();
        if ($nota->email_psicologo !== $psicologo->email) {
            return $this->wrongResponse("No tienes permiso para editar esta nota");
        }

        $nota->update([
            'descripcion' => $validatedData['descripcion'],
            'id_caso' => $validatedData['id_caso'] ?? null,
            'id_cita' => $validatedData['id_cita'] ?? null,
        ]);

        return $this->successResponse("Nota actualizada correctamente", new C_NotaResource($nota));
    }

    public function destroy(int $id)
    {
        $nota = C_Nota::findOrFail($id);
        $psicologo = request()->user();

        if ($nota->email_psicologo !== $psicologo->email) {
            return $this->wrongResponse("No tienes permiso para eliminar esta nota");
        }

        $nota->delete();

        return $this->successResponse("Nota eliminada correctamente", null);
    }
}
