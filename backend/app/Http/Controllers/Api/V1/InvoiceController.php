<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\InvoiceService;
use Illuminate\Http\Request;

class InvoiceController extends BaseController
{
    protected $invoiceService;

    // Inject InvoiceService ke dalam Controller
    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    public function print(Request $request, $id)
    {
        // Ambil token string dari query parameter '?token=...'
        $tokenString = $request->query('token');

        // Jalankan business logic melalui service
        $transaction = $this->invoiceService->prepareInvoice($id, $tokenString);

        // Render ke view blade exports/invoice.blade.php yang sudah kita buat sebelumnya
        return view('exports.invoice', compact('transaction'));
    }
}