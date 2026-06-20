<?php

namespace App\Http\Requests\Notification;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNotificationSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'low_stock_threshold' => [
                'required',
                'integer',
                'min:1'
            ],

            'expired_warning_days' => [
                'required',
                'integer',
                'min:1'
            ],

            'auto_notification' => [
                'required',
                'boolean'
            ],
        ];
    }
}