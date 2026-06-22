<?php

namespace App\Services;

use App\Repositories\InvoiceRepository;

class InvoiceService
{
    protected $invoiceRepository;

    public function __construct(InvoiceRepository $invoiceRepository)
    {
        $this->invoiceRepository = $invoiceRepository;
    }

    public function prepareInvoice($id, $tokenString = null)
    {
        // Kamu bisa masukkan business logic validasi token atau hak akses apoteker di sini jika diperlukan
        
        // Ambil data dari repository
        return $this->invoiceRepository->getInvoiceData($id);
    }
}