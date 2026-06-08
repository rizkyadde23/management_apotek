<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;

class AuthController extends BaseController
{
    public function __construct(
        private AuthService $authService
    ) {}

    public function login(
        LoginRequest $request
    ) {

        $result = $this->authService->login(
            $request->email,
            $request->password
        );

        return $this->success(
            $result,
            'Login berhasil'
        );
    }

    public function logout()
    {
        $this->authService->logout(
            auth()->user()
        );

        return $this->success(
            null,
            'Logout berhasil'
        );
    }
    public function me()
    {
        return $this->success(
            auth()->user()->load('role'),
            'Data user berhasil diambil'
        );
    }
}

