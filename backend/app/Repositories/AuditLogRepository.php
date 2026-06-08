<?php

namespace App\Repositories;

use App\Models\AuditLog;

class AuditLogRepository
{
    public function paginate($perPage = 20)
    {
        return AuditLog::with('user')
            ->latest()
            ->paginate($perPage);
    }

    public function findById($id)
    {
        return AuditLog::with('user')
            ->find($id);
    }

    public function getByUser($userId, $perPage = 20)
    {
        return AuditLog::where('user_id', $userId)
            ->with('user')
            ->latest()
            ->paginate($perPage);
    }

    public function getByAction($action, $perPage = 20)
    {
        return AuditLog::where('action', $action)
            ->with('user')
            ->latest()
            ->paginate($perPage);
    }

    public function getByModule($module, $perPage = 20)
    {
        return AuditLog::where('module', $module)
            ->with('user')
            ->latest()
            ->paginate($perPage);
    }

    public function getFiltered($filters, $perPage = 20)
    {
        $query = AuditLog::query();

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        if (isset($filters['module'])) {
            $query->where('module', $filters['module']);
        }

        if (isset($filters['start_date'])) {
            $query->whereDate('created_at', '>=', $filters['start_date']);
        }

        if (isset($filters['end_date'])) {
            $query->whereDate('created_at', '<=', $filters['end_date']);
        }

        return $query->with('user')
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data)
    {
        return AuditLog::create($data);
    }
}
