<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;

class TestController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->success(
            [
                'name' => 'Pharmacy Management System',
                'version' => '1.0.0'
            ],
            'API Running Successfully'
        );
    }
}