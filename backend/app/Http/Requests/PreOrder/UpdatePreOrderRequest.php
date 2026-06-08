<?php

namespace App\Http\Requests\PreOrder;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

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

            'status' => [
                'required',
                Rule::in([
                    'PENDING',
                    'READY',
                    'COMPLETED',
                    'CANCELLED'
                ])
            ],

            'estimated_arrival_date' => [
                'nullable',
                'date'
            ],

            'notes' => [
                'nullable',
                'string'
            ]
        ];
    }
}