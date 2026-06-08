<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'discount' => [
                'nullable',
                'numeric',
                'min:0'
            ],

            'items' => [
                'required',
                'array',
                'min:1'
            ],

            'items.*.medicine_id' => [
                'required',
                'exists:medicines,id'
            ],

            'items.*.quantity' => [
                'required',
                'integer',
                'min:1'
            ]
        ];
    }
}