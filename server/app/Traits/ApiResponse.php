<?php

namespace App\Traits;

trait ApiResponse
{
  protected function successResponse($message, $data)
  {
    return response()->json([
      'status' => 200,
      'data' => $data,
      'message' => $message
    ], 200);
  }

  protected function notFoundResponse($message)
  {
    return response()->json([
      'status' => 404,
      'data' => null,
      'message' => $message
    ], 404);
  }
}
