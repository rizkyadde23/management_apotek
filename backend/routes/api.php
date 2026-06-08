<?php

use App\Enums\UserRole;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\MedicineCategoryController;
use App\Http\Controllers\Api\V1\SupplierController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\MedicineController;
use App\Http\Controllers\Api\V1\StockLogController;
use App\Http\Controllers\Api\V1\LowStockController;
use App\Http\Controllers\Api\V1\ExpiredMedicineController;
use App\Http\Controllers\Api\V1\TransactionController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\InvoiceController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\PreOrderController;
use App\Http\Controllers\Api\V1\PurchaseOrderController;
use App\Http\Controllers\Api\V1\ExpiredMedicineAlertController;
use App\Http\Controllers\Api\V1\AuditLogController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\ChatController;

Route::get('/enum-test', function () {
    return UserRole::values();
});

Route::get('/medicine-test', function () {

    return \App\Models\Medicine::with([
        'supplier',
        'category'
    ])->get();

});

Route::get('/stock-log-test', function () {

    return \App\Models\StockLog::with([
        'medicine',
        'user'
    ])->get();

});

Route::get('/preorder-test', function () {

    return \App\Models\PreOrder::with([
        'medicine',
        'user'
    ])->get();

});

Route::get('/transaction-test', function () {

    return \App\Models\Transaction::with([
        'user',
        'details.medicine'
    ])->get();

});

Route::get('/payment-test', function () {

    return \App\Models\Payment::with([
        'transaction.user'
    ])->get();

});

Route::get('/notification-test', function () {

    return \App\Models\Notification::with(
        'user'
    )->get();

});

Route::post(
        '/login',
        [AuthController::class, 'login']
);

Route::middleware('auth:sanctum','role:ADMIN,OWNER')
        ->group(function () {
            Route::post(
                '/logout',
                [AuthController::class, 'logout']
            );
            Route::get('/me',
            [AuthController::class, 'me']);
            Route::apiResource(
            'users',
            UserController::class
        );
        Route::get(
    '/roles',
    [RoleController::class, 'index']
);

Route::post(
    '/roles',
    [RoleController::class, 'store']
);
        });

        Route::middleware([
    'auth:sanctum',
    'role:ADMIN,OWNER,APOTEKER'
])->group(function () {

    Route::apiResource(
        'medicine-categories',
        MedicineCategoryController::class
    );

});

Route::middleware([
    'auth:sanctum',
    'role:ADMIN,OWNER,APOTEKER'
])->group(function () {

    Route::apiResource(
        'suppliers',
        SupplierController::class
    );

});

Route::middleware([
    'auth:sanctum',
    'role:ADMIN,OWNER,APOTEKER'
])->group(function () {

    Route::apiResource(
        'medicines',
        MedicineController::class
    );

Route::get(
    '/stock-movements',
    [StockLogController::class, 'index']
);

Route::post(
    '/medicines/{medicine}/stock-in',
    [StockLogController::class, 'stockIn']
);

Route::post(
    '/medicines/{medicine}/stock-out',
    [StockLogController::class, 'stockOut']
);
});

Route::get(
    '/low-stock',
    [LowStockController::class, 'index']
);

Route::get(
    '/out-of-stock',
    [LowStockController::class, 'outOfStock']
);

Route::get(
    '/low-stock-summary',
    [LowStockController::class, 'summary']
);

Route::get(
    '/expired-medicines',
    [ExpiredMedicineController::class, 'expired']
);

Route::get(
    '/expiring-soon',
    [ExpiredMedicineController::class, 'expiringSoon']
);

Route::get(
    '/expired-summary',
    [ExpiredMedicineController::class, 'summary']
);

Route::middleware([
    'auth:sanctum',
    'role:ADMIN,APOTEKER,KASIR'
])->group(function () {

    Route::get(
        '/transactions',
        [TransactionController::class, 'index']
    );

    Route::get(
        '/transactions/{id}',
        [TransactionController::class, 'show']
    );

    Route::post(
        '/transactions',
        [TransactionController::class, 'store']
    );

    Route::post(
    '/transactions/{transaction}/pay',
    [PaymentController::class, 'pay']
);

Route::get(
    '/transactions/{id}/invoice',
    [InvoiceController::class, 'show']
);

Route::get(
    '/dashboard',
    [DashboardController::class, 'index']
);

Route::get(
    '/pre-orders',
    [PreOrderController::class, 'index']
);

Route::post(
    '/pre-orders',
    [PreOrderController::class, 'store']
);

Route::patch(
    '/pre-orders/{preOrder}/ready',
    [PreOrderController::class, 'ready']
);

Route::patch(
    '/pre-orders/{preOrder}/complete',
    [PreOrderController::class, 'complete']
);

Route::patch(
    '/pre-orders/{preOrder}/cancel',
    [PreOrderController::class, 'cancel']
);

Route::get(
    '/purchase-orders',
    [PurchaseOrderController::class, 'index']
);

Route::post(
    '/purchase-orders',
    [PurchaseOrderController::class, 'store']
);

Route::patch(
    '/purchase-orders/{purchaseOrder}/approve',
    [PurchaseOrderController::class, 'approve']
);

Route::patch(
    '/purchase-orders/{purchaseOrder}/receive',
    [PurchaseOrderController::class, 'receive']
);

Route::patch(
    '/purchase-orders/{purchaseOrder}/cancel',
    [PurchaseOrderController::class, 'cancel']
);

/*
|--------------------------------------------------------------------------
| Sprint 5 - Expired Medicine Monitoring
|--------------------------------------------------------------------------
*/
Route::middleware([
    'auth:sanctum',
    'role:ADMIN,OWNER,APOTEKER'
])->group(function () {
    Route::get('/expired-medicine-alerts', [ExpiredMedicineAlertController::class, 'index']);
    Route::get('/expired-medicine-alerts/{expiredMedicineAlert}', [ExpiredMedicineAlertController::class, 'show']);
    Route::get('/expired-medicine-alerts/status/{status}', [ExpiredMedicineAlertController::class, 'byStatus']);
    Route::get('/expired-medicines/expiring/{daysRange}', [ExpiredMedicineAlertController::class, 'expiringMedicines']);
    Route::post('/expired-medicine-alerts/generate', [ExpiredMedicineAlertController::class, 'generateAlerts']);
    Route::patch('/expired-medicine-alerts/{expiredMedicineAlert}/acknowledge', [ExpiredMedicineAlertController::class, 'acknowledge']);
    Route::patch('/expired-medicine-alerts/{expiredMedicineAlert}/resolve', [ExpiredMedicineAlertController::class, 'resolve']);
    Route::patch('/expired-medicine-alerts/{expiredMedicineAlert}/dismiss', [ExpiredMedicineAlertController::class, 'dismiss']);
    Route::delete('/expired-medicine-alerts/{expiredMedicineAlert}', [ExpiredMedicineAlertController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Sprint 7 - Audit Log System
|--------------------------------------------------------------------------
*/
Route::middleware([
    'auth:sanctum',
    'role:ADMIN,OWNER'
])->group(function () {
    Route::get('/audit-logs', [AuditLogController::class, 'index']);
    Route::get('/audit-logs/{auditLog}', [AuditLogController::class, 'show']);
    Route::get('/audit-logs/user/{userId}', [AuditLogController::class, 'byUser']);
    Route::get('/audit-logs/action/{action}', [AuditLogController::class, 'byAction']);
    Route::get('/audit-logs/module/{module}', [AuditLogController::class, 'byModule']);
    Route::post('/audit-logs/filter', [AuditLogController::class, 'filter']);
});

/*
|--------------------------------------------------------------------------
| Sprint 8 - Reporting & Export
|--------------------------------------------------------------------------
*/
Route::middleware([
    'auth:sanctum',
    'role:ADMIN,OWNER,APOTEKER'
])->group(function () {
    Route::get('/reports', [ReportController::class, 'index']);
    Route::get('/reports/my-reports', [ReportController::class, 'myReports']);
    Route::get('/reports/{report}', [ReportController::class, 'show']);
    Route::post('/reports/generate', [ReportController::class, 'generate']);
    Route::get('/reports/{report}/download', [ReportController::class, 'download']);
    Route::delete('/reports/{report}', [ReportController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| Sprint 7 - Notification System
|--------------------------------------------------------------------------
*/
Route::middleware([
    'auth:sanctum',
    'role:ADMIN,OWNER,APOTEKER,KASIR,PELANGGAN'
])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::get('/notifications/{id}', [NotificationController::class, 'show']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::delete('/notifications/delete-all', [NotificationController::class, 'destroyAll']);
});

/*
|--------------------------------------------------------------------------
| Sprint 7 - Chat System
|--------------------------------------------------------------------------
*/
Route::middleware([
    'auth:sanctum',
    'role:ADMIN,OWNER,APOTEKER,KASIR,PELANGGAN'
])->group(function () {
    Route::get('/chats', [ChatController::class, 'index']);
    Route::post('/chats/with/{userId}', [ChatController::class, 'getOrCreate']);
    Route::get('/chats/{chat}', [ChatController::class, 'show']);
    Route::get('/chats/{chat}/messages', [ChatController::class, 'messages']);
    Route::post('/chats/{chat}/messages', [ChatController::class, 'sendMessage']);
    Route::delete('/chats/{chat}/messages/{chatMessage}', [ChatController::class, 'deleteMessage']);
    Route::delete('/chats/{chat}', [ChatController::class, 'destroy']);
});
});

