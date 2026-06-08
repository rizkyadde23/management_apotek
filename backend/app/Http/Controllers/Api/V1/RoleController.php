<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends BaseController
{
    public function index()
    {
        return $this->success(
            Role::all()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'unique:roles,name'
            ]
        ]);

        $role = Role::create([
            'name' => strtoupper(
                $request->name
            )
        ]);

        return $this->success(
            $role,
            'Role berhasil dibuat',
            201
        );
    }
}