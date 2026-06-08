<?php

namespace App\Http\Requests\Medicine;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMedicineRequest extends FormRequest
{

    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
{
    return [

        'category_id' => [
            'required',
            'exists:medicine_categories,id'
        ],

        'supplier_id' => [
            'required',
            'exists:suppliers,id'
        ],

        'code' => [
            'required',
            'unique:medicines,code'
        ],

        'name' => [
            'required'
        ],

        'unit' => [
            'required'
        ],

        'purchase_price' => [
            'required',
            'numeric',
            'min:0'
        ],

        'selling_price' => [
            'required',
            'numeric',
            'gte:purchase_price'
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

        'expired_date' => [
            'required',
            'date',
            'after:today'
        ]
    ];
}
}
