<?php

namespace App\Exceptions;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    /* protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ]; */

    /**
     * Register the exception handling callbacks for the application.
     */
    /* public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    } */

    public function render($request, Throwable $exception)
    {
        if ($exception instanceof ValidationException) {
            return $this->invalidJson($request, $exception);
        }

        if ($exception instanceof ModelNotFoundException) {
            return response()->json([
                'status' => 404,
                'data' => null,
                'message' => 'Recurso no encontrado.'
            ], 404);
        }

        return parent::render($request, $exception);
    }

    protected function invalidJson($request, ValidationException $exception)
    {
        return response()->json([
            'status' => 422,
            'data' => null,
            'message' => $exception->validator->errors()->first(),
        ], 422);
    }
}
