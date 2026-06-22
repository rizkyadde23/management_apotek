<?php

namespace App\Services;

use App\Repositories\InvoiceRepository;
use Laravel\Sanctum\PersonalAccessToken;

class InvoiceService
{
    protected $invoiceRepository;

    public function __construct(InvoiceRepository $invoiceRepository)
    {
        $this->invoiceRepository = $invoiceRepository;
    }

    public function prepareInvoice($id, $tokenString = null)
    {
        // Jika token dikirim dengan kata kunci 'Bearer ', kita bersihkan terlebih dahulu
        if (str_starts_with($tokenString, 'Bearer ')) {
            $tokenString = str_replace('Bearer ', '', $tokenString);
        }

        if ($tokenString) {
            // Cari token ke database sanctum
            $token = PersonalAccessToken::findToken($tokenString);
            
            if (!$token) {
                abort(401, 'Token tidak ditemukan di sistem.');
            }

            $user = $token->tokenable;
            if (!$user) {
                abort(401, 'User pemilik token tidak ditemukan.');
            }

            // Autentikasi user secara manual untuk request ini
            auth()->login($user);
        } elseif (!auth()->check()) {
            abort(401, 'Sesi cetak struk membutuhkan autentikasi login.');
        }

        return $this->invoiceRepository->getInvoiceData($id);
    }
}