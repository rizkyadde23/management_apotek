<?php

namespace App\Http\Requests\PreOrder;

use Illuminate\Foundation\Http\FormRequest;

class StorePreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'medicine_id' => [
                'required',
                'exists:medicines,id'
            ],

            'customer_name' => [
                'required',
                'string',
                'max:255'
            ],

            'customer_phone' => [
                'required',
                'string',
                'max:255'
            ],

            'quantity' => [
                'required',
                'integer',
                'min:1'
            ],

            'estimated_arrival_date' => [
                'nullable',
                'date',
                'after_or_equal:today'
            ],

            'notes' => [
                'nullable',
                'string'
            ]
        ];
    }
}