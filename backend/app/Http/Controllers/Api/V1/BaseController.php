<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;

class BaseController extends Controller
{
    protected function success(
        mixed $data = null,
        string $message = 'Success',
        int $code = 200
    ) {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $code);
    }

    protected function error(
        string $message,
        int $code = 400
    ) {
        return response()->json([
            'success' => false,
            'message' => $message
        ], $code);
    }
}