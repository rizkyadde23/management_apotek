<?php

namespace App\Http\Middleware;

use Closure;
use App\Services\AuditLogService;
use Illuminate\Http\Request;

class LogAuditTrail
{
    public function __construct(
        private AuditLogService $auditLogService
    ) {}

    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($request->method() !== 'GET' && auth()->check()) {
            try {
                $action = $this->getActionFromMethod($request->method());
                $module = $this->getModuleFromRoute($request->route());

                $this->auditLogService->log(
                    $action,
                    $module,
                    "{$request->method()} {$request->path()}",
                    null,
                    $request->all()
                );
            } catch (\Exception $e) {
                // Silently fail - don't disrupt the normal flow
            }
        }

        return $response;
    }

    private function getActionFromMethod($method)
    {
        return match ($method) {
            'POST' => 'CREATE',
            'PUT', 'PATCH' => 'UPDATE',
            'DELETE' => 'DELETE',
            default => 'READ'
        };
    }

    private function getModuleFromRoute($route)
    {
        if (!$route) {
            return 'Unknown';
        }

        $path = $route->uri;
        $parts = explode('/', $path);
        
        return ucfirst($parts[1] ?? 'Unknown');
    }
}
