<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository
{
    public function paginate(
        ?string $search = null,
        int $perPage = 10
    ) {
        return User::with('role')
            ->when($search, function ($query) use ($search) {

                $query->where(function ($q) use ($search) {

                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");

                });

            })
            ->latest()
            ->paginate($perPage);
    }

    public function find(int $id): ?User
    {
        return User::with('role')->find($id);
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(
        User $user,
        array $data
    ): User {

        $user->update($data);

        return $user->fresh();
    }

    public function delete(User $user): void
    {
        $user->delete();
    }
}