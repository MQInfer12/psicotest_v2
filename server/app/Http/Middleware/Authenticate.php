<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    protected function redirectTo(Request $request): ?string
    {
        if (!$request->expectsJson()) {
            return null;
        }
    }

    protected function unauthenticated($request, array $guards)
    {
        abort(response()->json([
            'status' => 401,
            'data' => null,
            'message' => 'Sin autorización.',
        ], 401));
    }
}
