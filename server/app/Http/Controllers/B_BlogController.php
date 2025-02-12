<?php

namespace App\Http\Controllers;

use App\Constants\Permisos;
use App\Http\Requests\B_BlogRequest;
use App\Http\Resources\B_BlogResource;
use App\Models\B_Blog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class B_BlogController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $blogs = B_Blog::orderBy('updated_at', 'desc')->get();
        return $this->successResponse(
            "Blogs obtenidos correctamente.",
            B_BlogResource::collection($blogs)
        );
    }

    public function show(int $id)
    {
        $blog = B_Blog::findOrFail($id);
        return $this->successResponse(
            "Blog obtenido correctamente.",
            new B_BlogResource($blog)
        );
    }

    public function indexForMe(Request $request)
    {
        $blogs = B_Blog::orderBy('updated_at', 'desc')->where('email_autor', $request->user()->email)->get();
        return $this->successResponse(
            "Blogs obtenidos correctamente.",
            B_BlogResource::collection($blogs)
        );
    }

    public function store(B_BlogRequest $request)
    {
        $user = $request->user();
        $validatedData = $request->validated();

        $route = $validatedData['portada']->store('public/blogs');
        $route = str_replace('public/', '/', $route);

        $blog = B_Blog::create([
            'titulo' => $validatedData['titulo'],
            'descripcion' => $validatedData['descripcion'],
            'portada' => $route,
            'email_autor' => $user->email,
            'config' => $validatedData['config']
        ]);

        return $this->successResponse(
            "Blog creado correctamente.",
            new B_BlogResource($blog)
        );
    }

    public function update(B_BlogRequest $request, int $id)
    {
        $validatedData = $request->validated();

        $user = $request->user();
        $blog = B_Blog::findOrFail($id);

        if ($user->email != $blog->email_autor) {
            return $this->wrongResponse("No tienes permisos para editar este blog.");
        }

        $portada = $validatedData['portada'] ?? null;
        if ($portada) {
            $oldRoute = 'storage' . $blog->portada;
            if (file_exists($oldRoute)) {
                unlink($oldRoute);
            }
            $route = $portada->store('public/blogs');
            $portada = str_replace('public/', '/', $route);
        } else {
            $portada = $blog->portada;
        }

        $blog->update([
            'titulo' => $validatedData['titulo'],
            'descripcion' => $validatedData['descripcion'],
            'portada' => $portada,
            'config' => $validatedData['config']
        ]);

        return $this->successResponse(
            "Blog actualizado correctamente.",
            new B_BlogResource($blog)
        );
    }

    public function standOut(Request $request, int $id)
    {
        $user = $request->user();
        if (!in_array(Permisos::DESTACAR_BLOGS, $user->rol->permisos)) {
            return $this->wrongResponse('No tienes permisos para destacar blogs.');
        }

        $blog = B_Blog::findOrFail($id);
        if ($blog->destacado) {
            $blog->update([
                'destacado' => false
            ]);
        } else {
            B_Blog::where('destacado', true)->update([
                'destacado' => false
            ]);
            $blog->update([
                'destacado' => true
            ]);
        }

        return $this->successResponse(
            "Blog destacado correctamente.",
            new B_BlogResource($blog)
        );
    }

    public function destroy(Request $request, int $id)
    {
        $user = $request->user();
        $blog = B_Blog::findOrFail($id);

        if ($user->email != $blog->email_autor && !in_array(Permisos::DESTACAR_BLOGS, $user->rol->permisos)) {
            return $this->wrongResponse("No tienes permisos para eliminar este blog.");
        }

        $route = 'storage' . $blog->portada;
        if (file_exists($route)) {
            unlink($route);
        }
        $blog->delete();
        return $this->successResponse("Blog eliminado correctamente.", null);
    }
}
