<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }


public function rules(): array
{
    return [
        'code' => [
            'required',
            Rule::unique('suppliers')
                ->ignore(
                    $this->route('supplier')
                )
        ],

        'name' => [
            'required'
        ],

        'phone' => [
            'nullable'
        ],

        'email' => [
            'nullable',
            'email'
        ]
    ];
}
}
