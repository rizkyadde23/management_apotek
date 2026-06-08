<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class GenerateReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'required|in:MEDICINE,SALES,STOCK,AUDIT_LOG,PURCHASE_ORDER',
            'format' => 'required|in:pdf,excel',
            'filters' => 'nullable|array',
            'filters.start_date' => 'nullable|date',
            'filters.end_date' => 'nullable|date|after_or_equal:filters.start_date',
            'filters.medicine_id' => 'nullable|exists:medicines,id',
            'filters.supplier_id' => 'nullable|exists:suppliers,id',
            'filters.status' => 'nullable|string'
        ];
    }
}
