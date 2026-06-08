<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class PayTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'amount_paid' => [
                'required',
                'numeric',
                'min:1'
            ],

            'payment_method' => [
                'required',
                'in:CASH,QRIS,TRANSFER'
            ]
        ];
    }
}