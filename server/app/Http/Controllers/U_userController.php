<?php

namespace App\Http\Controllers;

use App\Http\Requests\U_userChangeRolRequest;
use App\Http\Requests\U_userStoreRequest;
use App\Http\Requests\U_userUpdateRequest;
use App\Http\Resources\U_userResource;
use App\Models\C_Cita;
use App\Models\U_Rol;
use App\Models\U_user;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class U_userController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $users = U_user::orderBy("email")->get();
        return $this->successResponse(
            "Usuarios obtenidos correctamente.",
            U_userResource::collection($users)
        );
    }

    public function indexForPatients(Request $request)
    {
        $citas = C_Cita::where('email_psicologo', $request->user()->email)
            ->with('paciente')
            ->get();
        $pacientes = $citas->pluck('paciente')->unique('email')->values();
        return $this->successResponse(
            "Pacientes obtenidos correctamente.",
            U_userResource::collection($pacientes)
        );
    }

    public function showProfile(Request $request, string $email)
    {
        $citas = C_Cita::where('email_psicologo', $request->user()->email)
            ->with('paciente')
            ->get();
        $pacientes = $citas->pluck('paciente')->unique('email')->values();

        if (!$pacientes->contains('email', $email)) {
            return $this->wrongResponse("No tienes permisos para ver esto");
        }

        $user = U_user::findOrFail($email);

        return $this->successResponse(
            "Usuario obtenido correctamente.",
            new U_userResource($user)
        );
    }

    public function store(U_userStoreRequest $request)
    {
        $validatedData = $request->validated();
        $defaultRol = U_Rol::where('por_defecto', true)->firstOrFail();
        $validatedData['id_rol'] = $defaultRol->id;

        $user = U_user::create($validatedData);
        $user['estado'] = true;

        return $this->successResponse(
            "Usuario creado correctamente.",
            new U_userResource($user)
        );
    }

    public function show(string $email)
    {
        $user = U_user::findOrFail($email);
        return $this->successResponse(
            "Usuario obtenido correctamente.",
            new U_userResource($user)
        );
    }

    public function update(string $email, U_userUpdateRequest $request)
    {
        $validatedData = $request->validated();

        $user = U_user::findOrFail($email);

        $user->update($validatedData);

        return $this->successResponse(
            "Usuario actualizado correctamente.",
            new U_userResource($user)
        );
    }

    public function changeRol(string $email, U_userChangeRolRequest $request)
    {
        $validatedData = $request->validated();

        $user = U_user::findOrFail($email);
        $user->id_rol = $validatedData['id_rol'];

        $user->save();

        return $this->successResponse(
            "Rol del usuario actualizado correctamente.",
            new U_userResource($user)
        );
    }

    public function changeState(string $email)
    {
        $user = U_user::findOrFail($email);
        $user->estado = !$user->estado;

        $user->save();

        return $this->successResponse(
            "Estado del usuario actualizado correctamente.",
            new U_userResource($user)
        );
    }

    public function disponibilityToggle(string $email)
    {
        $user = U_user::findOrFail($email);
        $user->disponible = !$user->disponible;

        $user->save();

        return $this->successResponse(
            $user->disponible ? "Ahora estas disponible." : "Ya no estás disponible.",
            new U_userResource($user)
        );
    }

    public function destroy(string $email)
    {
        $user = U_user::findOrFail($email);

        $user->delete();

        return $this->successResponse(
            "Usuario eliminado correctamente.",
            null
        );
    }
}
