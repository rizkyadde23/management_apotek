<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
{
    return [
        'role_id' => [
            'required',
            'exists:roles,id'
        ],

        'name' => [
            'required'
        ],

        'email' => [
            'required',
            'email',
            Rule::unique('users')
                ->ignore($this->route('user')->id)
        ],

        'password' => [
            'nullable',
            'min:8'
        ],

        'is_active' => [
            'boolean'
        ]
    ];
}
}