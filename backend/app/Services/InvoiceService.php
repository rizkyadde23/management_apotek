<?php

namespace App\Services;

use App\Repositories\InvoiceRepository;

class InvoiceService
{
    public function __construct(
        private InvoiceRepository $repository
    ) {}

    public function getInvoice(int $transactionId)
    {
        return $this->repository
            ->findByTransaction(
                $transactionId
            );
    }
}