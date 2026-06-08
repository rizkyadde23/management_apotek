<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\InvoiceService;

class InvoiceController extends BaseController
{
    public function __construct(
        private InvoiceService $service
    ) {}

    public function show(int $id)
    {
        return $this->success(
            $this->service->getInvoice($id),
            'Invoice berhasil diambil'
        );
    }
}