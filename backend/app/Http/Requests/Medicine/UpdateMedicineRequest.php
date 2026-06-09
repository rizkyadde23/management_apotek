<?php

namespace App\Http\Requests\Medicine;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMedicineRequest extends FormRequest
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
            Rule::unique('medicines')
                ->ignore($this->route('medicine'))
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