<?php

namespace App\Repositories;

use App\Models\Report;

class ReportRepository
{
    public function paginate($perPage = 15)
    {
        return Report::with('user')
            ->latest()
            ->paginate($perPage);
    }

    public function findById($id)
    {
        return Report::with('user')
            ->find($id);
    }

    public function getByUser($userId, $perPage = 15)
    {
        return Report::where('user_id', $userId)
            ->with('user')
            ->latest()
            ->paginate($perPage);
    }

    public function getByType($type, $perPage = 15)
    {
        return Report::where('type', $type)
            ->with('user')
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data)
    {
        return Report::create($data);
    }

    public function update($id, array $data)
    {
        $report = $this->findById($id);
        if ($report) {
            $report->update($data);
        }
        return $report;
    }

    public function delete($id)
    {
        return Report::destroy($id);
    }
}
