<?php

namespace App\Services;

use App\Repositories\AuditLogRepository;

class AuditLogService
{
    public function __construct(
        private AuditLogRepository $repository
    ) {}

    public function getAll($perPage = 20)
    {
        return $this->repository->paginate($perPage);
    }

    public function getById($id)
    {
        return $this->repository->findById($id);
    }

    public function getByUser($userId, $perPage = 20)
    {
        return $this->repository->getByUser($userId, $perPage);
    }

    public function getByAction($action, $perPage = 20)
    {
        return $this->repository->getByAction($action, $perPage);
    }

    public function getByModule($module, $perPage = 20)
    {
        return $this->repository->getByModule($module, $perPage);
    }

    public function getFiltered($filters, $perPage = 20)
    {
        return $this->repository->getFiltered($filters, $perPage);
    }

    public function create(array $data)
    {
        return $this->repository->create($data);
    }

    public function log($action, $module, $description, $oldValue = null, $newValue = null)
    {
        return $this->create([
            'user_id' => auth()->id(),
            'action' => $action,
            'module' => $module,
            'description' => $description,
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'ip_address' => request()->ip(),
            'user_agent' => request()->header('User-Agent')
        ]);
    }
}
