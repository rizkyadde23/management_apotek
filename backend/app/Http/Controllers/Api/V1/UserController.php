<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\User;
use App\Services\UserService;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;

class UserController extends BaseController
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index()
    {
        return $this->success(
            $this->userService->getAll(
                request('search')
            )
        );
    }

    public function show(
        int $id
    ) {

        return $this->success(
            $this->userService->getById($id)
        );
    }

    public function store(
        StoreUserRequest $request
    ) {

        return $this->success(
            $this->userService->create(
                $request->validated()
            ),
            'User berhasil dibuat',
            201
        );
    }

    public function update(
        UpdateUserRequest $request,
        User $user
    ) {

        return $this->success(
            $this->userService->update(
                $user,
                $request->validated()
            ),
            'User berhasil diperbarui'
        );
    }

    public function destroy(
        User $user
    ) {

        $this->userService->delete($user);

        return $this->success(
            null,
            'User berhasil dihapus'
        );
    }
}