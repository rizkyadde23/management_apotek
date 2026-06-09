<?php

namespace App\Http\Requests\Medicine;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMedicineRequest extends FormRequest
{

public function authorize(): bool
{
    return true;
}

public function rules(): array
{
    return [
        'supplier_id' => [
            'required',
            'exists:suppliers,id'
        ],

        'category_id' => [
            'required',
            'exists:medicine_categories,id'
        ],

        'code' => [
            'required',
            'unique:medicines,code'
        ],

        'batch_number' => [
            'required'
        ],

        'name' => [
            'required'
        ],

        'description' => [
            'nullable'
        ],

        'type' => [
            'required'
        ],

        'stock' => [
            'required',
            'integer',
            'min:0'
        ],

        'minimum_stock' => [
            'required',
            'integer',
            'min:1'
        ],

        'price' => [
            'required',
            'numeric',
            'min:0'
        ],

        'expired_date' => [
            'required',
            'date'
        ],

        'is_active' => [
            'boolean'
        ]
    ];
}
}
