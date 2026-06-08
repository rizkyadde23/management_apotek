<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
                'required',
                'string',
                'max:100'
            ],

            'email' => [
                'required',
                'email',
                'unique:users,email'
            ],

            'password' => [
                'required',
                'min:8'
            ]
        ];
    }
}