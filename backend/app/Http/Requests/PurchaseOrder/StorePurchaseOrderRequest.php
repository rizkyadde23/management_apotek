<?php

namespace App\Http\Requests\PurchaseOrder;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePurchaseOrderRequest extends FormRequest
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

        'notes' => [
            'nullable'
        ],

        'items' => [
            'required',
            'array',
            'min:1'
        ],

        'items.*.medicine_id' => [
            'required',
            'exists:medicines,id'
        ],

        'items.*.quantity' => [
            'required',
            'integer',
            'min:1'
        ],

        'items.*.unit_price' => [
            'required',
            'numeric',
            'min:0'
        ],

        'pre_order_ids' => [
    'nullable',
    'array'
],

'pre_order_ids.*' => [
    'exists:pre_orders,id'
],
    ];
}
}