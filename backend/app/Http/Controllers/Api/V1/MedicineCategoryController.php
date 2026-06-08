<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\MedicineCategoryService;

class MedicineCategoryController extends BaseController
{
    public function __construct(
        private MedicineCategoryService $service
    ) {}

    public function index()
{
    return $this->success(
        $this->service->getAll()
    );
}

public function store(
    StoreMedicineCategoryRequest $request
)
{
    return $this->success(
        $this->service->create(
            $request->validated()
        ),
        'Kategori berhasil dibuat',
        201
    );
}
}
