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

  protected function wrongResponse($message)
  {
    return response()->json([
      'status' => 400,
      'data' => null,
      'message' => $message
    ], 400);
  }

  protected function notFoundResponse($message)
  {
    return response()->json([
      'status' => 404,
      'data' => null,
      'message' => $message
    ], 404);
  }

  protected function unauthorizedResponse($message)
  {
    return response()->json([
      'status' => 401,
      'data' => null,
      'message' => $message
    ], 401);
  }
}
