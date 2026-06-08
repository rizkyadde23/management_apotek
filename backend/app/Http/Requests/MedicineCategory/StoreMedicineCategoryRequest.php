<?php

namespace App\Http\Requests\MedicineCategory;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMedicineCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
{
    return [
        'name' => [
            'required',
            'max:100',
            'unique:medicine_categories,name'
        ],

        'description' => [
            'nullable',
            'max:255'
        ]
    ];
}
}
