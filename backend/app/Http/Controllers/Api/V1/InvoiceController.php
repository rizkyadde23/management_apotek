<?php

namespace App\Http\Controllers\Api\V1;

use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf; // 🌟 Taruh Facade PDF di Controller saja

class InvoiceController extends BaseController
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    public function print(Request $request, $id)
    {
        try {
            $tokenString = $request->query('auth_token') ?? $request->bearerToken();

            // 1. Ambil data (sekarang relasinya sudah benar dari Repository)
            $transaction = $this->invoiceService->prepareInvoice($id, $tokenString);

            // 2. Render PDF
            $pdf = Pdf::loadView('exports.invoice', compact('transaction'));

            // 3. Kembalikan sebagai stream Blob
            return $pdf->stream("invoice-transaction-{$id}.pdf", [
                'Content-Type' => 'application/pdf',
            ]);

        } catch (\Exception $e) {
            // Jika masih error, pesan ini akan terlihat di log atau response
            return response()->json([
                'status'  => 'Error terdeteksi!',
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine()
            ], 500);
        }
    }
}