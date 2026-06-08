<?php

namespace App\Services;

use App\Repositories\AuthRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private AuthRepository $authRepository
    ) {}

    public function login(
        string $email,
        string $password
    ): array {

        $user = $this->authRepository
            ->findByEmail($email);

        if (!$user) {

            throw ValidationException::withMessages([
                'email' => [
                    'Email tidak ditemukan'
                ]
            ]);
        }

        if (
            !Hash::check(
                $password,
                $user->password
            )
        ) {

            throw ValidationException::withMessages([
                'password' => [
                    'Password salah'
                ]
            ]);
        }

        if (!$user->is_active) {

            throw ValidationException::withMessages([
                'user' => [
                    'Akun tidak aktif'
                ]
            ]);
        }

        $token = $user->createToken(
            'auth_token'
        )->plainTextToken;

        return [
            'user' => $user->load('role'),
            'token' => $token
        ];
    }

    public function logout($user): void
    {
        $user->currentAccessToken()->delete();
    }
}