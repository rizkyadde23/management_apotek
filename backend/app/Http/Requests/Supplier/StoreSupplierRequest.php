<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
{public function authorize(): bool
{
    return true;
}

public function rules(): array
{
    return [
        'name' => [
            'required',
            'max:100'
        ],

        'phone' => [
            'nullable',
            'max:20'
        ],

        'email' => [
            'nullable',
            'email'
        ],

        'address' => [
            'nullable'
        ]
    ];
}
}
