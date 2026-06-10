<?php

namespace App\Http\Requests\MedicineCategory;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMedicineCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('medicine_categories', 'name')
    ->ignore(
        $this->route('medicine_category')->id
    )
            ],

            'description' => [
                'nullable',
                'string',
                'max:500'
            ]
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama kategori wajib diisi',
            'name.unique' => 'Nama kategori sudah digunakan',
            'name.max' => 'Nama kategori maksimal 255 karakter',

            'description.max' => 'Deskripsi maksimal 500 karakter'
        ];
    }
}