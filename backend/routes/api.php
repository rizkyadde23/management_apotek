<?php

use App\Enums\UserRole;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\MedicineController;
use App\Http\Controllers\Api\V1\MedicineCategoryController;
use App\Http\Controllers\Api\V1\SupplierController;
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
use App\Http\Controllers\Api\V1\NotificationSettingController;

/*
|--------------------------------------------------------------------------
| Public Routes (Authentication)
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| Protected Routes (Semua User Harus Login via Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Sesi Inti User Login
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Cetak Struk (Menerima Otentikasi Token Manual dari URL Query Parameter)
    Route::get('/transactions/{transaction}/invoice', [InvoiceController::class, 'print']);

    /*
    |--------------------------------------------------------------------------
    | Role: ADMINISTRATOR ONLY
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:ADMIN')->group(function () {
        Route::apiResource('users', UserController::class);
        
        Route::get('/roles', [RoleController::class, 'index']);
        Route::post('/roles', [RoleController::class, 'store']);
        
        Route::post('/purchase-orders', [PurchaseOrderController::class, 'store']);
        Route::patch('/purchase-orders/{purchaseOrder}/approve', [PurchaseOrderController::class, 'approve']);
        Route::patch('/purchase-orders/{purchaseOrder}/receive', [PurchaseOrderController::class, 'receive']);
        Route::patch('/purchase-orders/{purchaseOrder}/cancel', [PurchaseOrderController::class, 'cancel']);
        
        Route::get('/notification-settings', [NotificationSettingController::class, 'show']);
        Route::put('/notification-settings', [NotificationSettingController::class, 'update']);
    });

    /*
    |--------------------------------------------------------------------------
    | Role: ADMINISTRATOR & OWNER (Manajerial & Pengawasan Audit)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:ADMIN,OWNER')->group(function () {
        Route::get('/purchase-orders', [PurchaseOrderController::class, 'index']);
        Route::get('/purchase-orders/{purchaseOrder}', [PurchaseOrderController::class, 'show']);
        
        // Audit Logs Sistem
        Route::get('/audit-logs', [AuditLogController::class, 'index']);
        Route::get('/audit-logs/{auditLog}', [AuditLogController::class, 'show']);
        Route::get('/audit-logs/user/{userId}', [AuditLogController::class, 'byUser']);
        Route::get('/audit-logs/action/{action}', [AuditLogController::class, 'byAction']);
        Route::get('/audit-logs/module/{module}', [AuditLogController::class, 'byModule']);
        Route::post('/audit-logs/filter', [AuditLogController::class, 'filter']);

        // Laporan Manajemen Keuangan Finansial (Hanya Admin & Owner)
        Route::get('/reports', [ReportController::class, 'index']);
        Route::get('/reports/my-reports', [ReportController::class, 'myReports']);
        Route::get('/reports/{report}', [ReportController::class, 'show']);
        Route::post('/reports/generate', [ReportController::class, 'generate']);
        Route::get('/reports/{report}/download', [ReportController::class, 'download']);
        Route::delete('/reports/{report}', [ReportController::class, 'destroy']);
    });

    /*
    |--------------------------------------------------------------------------
    | Role: ADMINISTRATOR, OWNER & APOTEKER (Operasional Apotek & POS Kasir)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:ADMIN,OWNER,APOTEKER')->group(function () {
        
        // Master Data Inventori Obat & Supplier
        Route::apiResource('medicine-categories', MedicineCategoryController::class);
        Route::apiResource('medicines', MedicineController::class);
        Route::apiResource('suppliers', SupplierController::class);
        
        // Manajemen Keluar Masuk Log Stok Obat
        Route::get('/stock-movements', [StockLogController::class, 'index']);
        Route::post('/medicines/{medicine}/stock-in', [StockLogController::class, 'stockIn']);
        Route::post('/medicines/{medicine}/stock-out', [StockLogController::class, 'stockOut']);
        
        // Fitur Monitoring Stok Tipis & Kedaluwarsa
        Route::get('/low-stock', [LowStockController::class, 'index']);
        Route::get('/out-of-stock', [LowStockController::class, 'outOfStock']);
        Route::get('/low-stock-summary', [LowStockController::class, 'summary']);
        Route::get('/expired-medicines', [ExpiredMedicineController::class, 'expired']);
        Route::get('/expiring-soon', [ExpiredMedicineController::class, 'expiringSoon']);
        Route::get('/expired-summary', [ExpiredMedicineController::class, 'summary']);
        
        // Dashboard Ringkasan Data
        Route::get('/dashboard', [DashboardController::class, 'index']);
        
        // Fitur Transaksi & Pembayaran Kasir POS (Ujung Tombak Apoteker)
        Route::get('/transactions', [TransactionController::class, 'index']);
        Route::get('/transactions/{id}', [TransactionController::class, 'show']);
        Route::post('/transactions', [TransactionController::class, 'store']);
        Route::post('/transactions/{transaction}/pay', [PaymentController::class, 'pay']);
        
        // Pre-Order Sistem
        Route::get('/pre-orders', [PreOrderController::class, 'index']);
        Route::post('/pre-orders', [PreOrderController::class, 'store']);
        Route::get('/pre-orders/{preOrder}', [PreOrderController::class, 'show']);
        Route::put('/pre-orders/{preOrder}', [PreOrderController::class, 'update']);
        Route::delete('/pre-orders/{preOrder}', [PreOrderController::class, 'destroy']);
        Route::patch('/pre-orders/{preOrder}/ready', [PreOrderController::class, 'ready']);
        Route::patch('/pre-orders/{preOrder}/complete', [PreOrderController::class, 'complete']);
        Route::patch('/pre-orders/{preOrder}/cancel', [PreOrderController::class, 'cancel']);
        
        // Notifikasi Internal Aplikasi
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
        Route::get('/notifications/{id}', [NotificationController::class, 'show']);
        Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
        Route::delete('/notifications/delete-all', [NotificationController::class, 'destroyAll']);
        
        // Peringatan Obat Kedaluwarsa (Expired Alert)
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

});