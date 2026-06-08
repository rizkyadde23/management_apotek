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
                Rule::unique('medicines')
                    ->ignore(
                        $this->route('medicine')
                    )
            ],

            'name' => [
                'required',
                'max:255'
            ],

            'generic_name' => [
                'nullable',
                'max:255'
            ],

            'unit' => [
                'required',
                'max:50'
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
            ],

            'is_active' => [
                'boolean'
            ]
        ];
    }
}