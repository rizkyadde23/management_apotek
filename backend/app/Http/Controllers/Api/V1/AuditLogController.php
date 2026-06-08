<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\AuditLog;
use App\Services\AuditLogService;
use App\Http\Requests\AuditLog\FilterAuditLogRequest;

class AuditLogController extends BaseController
{
    public function __construct(
        private AuditLogService $service
    ) {}

    public function index()
    {
        return $this->success(
            $this->service->getAll(),
            'Daftar audit log berhasil diambil'
        );
    }

    public function show(AuditLog $auditLog)
    {
        return $this->success(
            $this->service->getById($auditLog->id),
            'Detail audit log berhasil diambil'
        );
    }

    public function byUser($userId)
    {
        return $this->success(
            $this->service->getByUser($userId),
            'Audit log user berhasil diambil'
        );
    }

    public function byAction($action)
    {
        return $this->success(
            $this->service->getByAction($action),
            "Audit log action {$action} berhasil diambil"
        );
    }

    public function byModule($module)
    {
        return $this->success(
            $this->service->getByModule($module),
            "Audit log module {$module} berhasil diambil"
        );
    }

    public function filter(FilterAuditLogRequest $request)
    {
        return $this->success(
            $this->service->getFiltered($request->validated()),
            'Audit log filter berhasil diambil'
        );
    }
}
