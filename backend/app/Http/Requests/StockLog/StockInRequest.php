<?php

namespace App\Http\Requests\StockLog;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StockInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

   public function rules(): array
{
    return [
        'quantity' => [
            'required',
            'integer',
            'min:1'
        ],

        'notes' => [
            'nullable'
        ]
    ];
}
}
