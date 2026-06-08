<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

class UserService
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    public function getAll(
        ?string $search = null
    ) {
        return $this->userRepository
            ->paginate($search);
    }

    public function getById(
        int $id
    ) {
        return $this->userRepository
            ->find($id);
    }

    public function create(
        array $data
    ) {

        $data['password'] = Hash::make(
            $data['password']
        );

        return $this->userRepository
            ->create($data);
    }

    public function update(
        User $user,
        array $data
    ) {

        if (
            isset($data['password'])
            && !empty($data['password'])
        ) {

            $data['password'] = Hash::make(
                $data['password']
            );

        } else {

            unset($data['password']);

        }

        return $this->userRepository
            ->update($user, $data);
    }

    public function delete(
        User $user
    ) {

        $this->userRepository
            ->delete($user);
    }
}