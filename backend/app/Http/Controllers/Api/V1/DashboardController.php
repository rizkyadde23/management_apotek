<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\DashboardService;

class DashboardController extends BaseController
{
    public function __construct(
        private DashboardService $service
    ) {}

    public function index()
    {
        return $this->success(
            $this->service->summary(),
            'Dashboard berhasil diambil'
        );
    }
}