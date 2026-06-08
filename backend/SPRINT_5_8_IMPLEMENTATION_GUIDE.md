# Backend Sprint Implementation Guide (Sprints 5-8)

## Overview

Ini adalah panduan lengkap untuk implementasi backend untuk Sprint 5-8. Semua file sudah dibuat dan siap digunakan.

---

## Sprint 5: Expired Medicine Monitoring

### Fitur
- ✅ Monitor obat yang akan kadaluarsa
- ✅ Generate alert otomatis (30, 14, 7 hari sebelum kadaluarsa)
- ✅ Status alert: PENDING, ACKNOWLEDGED, RESOLVED, DISMISSED
- ✅ Alert type: CRITICAL, WARNING, INFO

### Files
```
Models/
  - ExpiredMedicineAlert.php

Migrations/
  - 2026_06_09_000100_create_expired_medicine_alerts_table.php

Repositories/
  - ExpiredMedicineAlertRepository.php

Services/
  - ExpiredMedicineAlertService.php

Controllers/
  - ExpiredMedicineAlertController.php

Enums/
  - ExpiredMedicineAlertType.php
  - ExpiredMedicineAlertStatus.php

Seeders/
  - ExpiredMedicineAlertSeeder.php

Console/Commands/
  - GenerateExpiredMedicineAlerts.php
```

### API Endpoints
```
GET    /api/v1/expired-medicine-alerts              - Get all alerts
GET    /api/v1/expired-medicine-alerts/{id}         - Get alert detail
GET    /api/v1/expired-medicine-alerts/status/{status} - Filter by status
GET    /api/v1/expired-medicines/expiring/{daysRange}  - Get expiring medicines
POST   /api/v1/expired-medicine-alerts/generate    - Generate alerts manually
PATCH  /api/v1/expired-medicine-alerts/{id}/acknowledge  - Mark as acknowledged
PATCH  /api/v1/expired-medicine-alerts/{id}/resolve     - Mark as resolved
PATCH  /api/v1/expired-medicine-alerts/{id}/dismiss     - Dismiss alert
DELETE /api/v1/expired-medicine-alerts/{id}        - Delete alert
```

### Setup
1. Run migration: `php artisan migrate`
2. Seed data: `php artisan db:seed --class=ExpiredMedicineAlertSeeder`
3. Generate alerts: `php artisan alerts:generate-expired-medicines`

### Schedule (dalam Kernel.php)
```php
$schedule->command('alerts:generate-expired-medicines')
    ->dailyAt('01:00');  // Jalankan setiap hari pukul 01:00
```

---

## Sprint 6: Dashboard Analytics

### Fitur
- ✅ Medicine statistics (total, low stock, expired, expiring soon)
- ✅ Stock statistics (total value, low stock items)
- ✅ Sales statistics (monthly revenue, top selling medicines)
- ✅ Purchase order statistics
- ✅ Pre-order statistics & completion rate
- ✅ Daily sales chart
- ✅ Medicine stock chart

### Files
```
Services/
  - DashboardService.php (sudah ada, updated)

Controllers/
  - DashboardController.php (sudah ada, updated)
```

### API Endpoints
```
GET /api/v1/dashboard/overview            - Get all dashboard metrics
GET /api/v1/dashboard/daily-sales         - Get daily sales chart
GET /api/v1/dashboard/medicine-stock      - Get medicine stock chart
```

### Response Example
```json
{
  "success": true,
  "data": {
    "medicines": {
      "total": 50,
      "low_stock_count": 5,
      "expired_count": 2,
      "expiring_soon_count": 8
    },
    "stock": {
      "total_value": 5000000,
      "low_stock_items": [...]
    },
    "sales": {
      "total_transactions_30d": 150,
      "total_revenue_30d": 2500000,
      "top_selling_medicines": [...]
    },
    "purchase_orders": {...},
    "pre_orders": {...}
  }
}
```

---

## Sprint 7: Audit Log System

### Fitur
- ✅ Automatic logging untuk semua CRUD operations
- ✅ Track user actions dengan timestamp
- ✅ Store old & new values (untuk UPDATE)
- ✅ Record IP address & user agent
- ✅ Filter logs by user, action, module, date range

### Files
```
Models/
  - AuditLog.php

Migrations/
  - 2026_06_09_000200_create_audit_logs_table.php

Repositories/
  - AuditLogRepository.php

Services/
  - AuditLogService.php

Controllers/
  - AuditLogController.php

Middleware/
  - LogAuditTrail.php

Http/Requests/
  - AuditLog/FilterAuditLogRequest.php

Enums/
  - AuditLogAction.php
```

### API Endpoints
```
GET    /api/v1/audit-logs                      - Get all audit logs
GET    /api/v1/audit-logs/{id}                - Get audit log detail
GET    /api/v1/audit-logs/user/{userId}       - Filter by user
GET    /api/v1/audit-logs/action/{action}     - Filter by action
GET    /api/v1/audit-logs/module/{module}     - Filter by module
POST   /api/v1/audit-logs/filter               - Advanced filtering (dengan date range)
```

### Setup
1. Run migration: `php artisan migrate`
2. Register middleware di `app/Http/Kernel.php`:
```php
protected $routeMiddleware = [
    // ...
    'log-audit' => \App\Http\Middleware\LogAuditTrail::class,
];
```

### Usage di Routes
```php
Route::middleware(['auth:sanctum', 'log-audit'])->group(function () {
    // Your protected routes here
});
```

### Manual Logging
```php
$auditLogService->log(
    'UPDATE',
    'Medicine',
    'Updated medicine price',
    ['price' => 50000],
    ['price' => 60000]
);
```

---

## Sprint 8: Reporting & Export PDF/Excel

### Fitur
- ✅ Generate reports dalam berbagai format (PDF, Excel)
- ✅ Report types: Medicine, Sales, Stock, Audit Log, Purchase Order
- ✅ Store generated reports
- ✅ Download reports
- ✅ Filter reports by user, type, date

### Files
```
Models/
  - Report.php

Migrations/
  - 2026_06_09_000300_create_reports_table.php

Repositories/
  - ReportRepository.php

Services/
  - ReportService.php

Controllers/
  - ReportController.php

Http/Requests/
  - Report/GenerateReportRequest.php

Enums/
  - ReportType.php
```

### API Endpoints
```
GET    /api/v1/reports                     - Get all reports
GET    /api/v1/reports/{id}               - Get report detail
GET    /api/v1/reports/my-reports          - Get user's reports
POST   /api/v1/reports/generate            - Generate new report
GET    /api/v1/reports/{id}/download       - Download report file
DELETE /api/v1/reports/{id}               - Delete report
```

### Request Body (Generate Report)
```json
{
  "type": "MEDICINE",
  "format": "pdf",
  "filters": {
    "start_date": "2026-01-01",
    "end_date": "2026-06-09",
    "supplier_id": 1,
    "status": "ACTIVE"
  }
}
```

### Setup

#### Step 1: Install Dependencies
```bash
composer require maatwebsite/excel
composer require dompdf/dompdf
```

#### Step 2: Publish Excel Config (optional)
```bash
php artisan vendor:publish --provider="Maatwebsite\Excel\ExcelServiceProvider"
```

#### Step 3: Create Export/Import Classes
Buat di `app/Exports/` untuk setiap report type:
```php
// app/Exports/MedicineExport.php
namespace App\Exports;

use App\Models\Medicine;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;

class MedicineExport implements FromQuery, WithHeadings
{
    public function query()
    {
        return Medicine::query();
    }

    public function headings(): array
    {
        return ['ID', 'Name', 'Code', 'Stock', 'Price'];
    }
}
```

#### Step 4: Update ReportService Methods
Replace placeholder implementations dengan actual export logic menggunakan Excel/PDF library.

---

## Environment Setup

### 1. Run Migrations
```bash
php artisan migrate
```

### 2. Seed Data (Optional)
```bash
php artisan db:seed --class=ExpiredMedicineAlertSeeder
```

### 3. Register Middleware
Update `app/Http/Kernel.php`:
```php
protected $middleware = [
    // ...
    \App\Http\Middleware\LogAuditTrail::class,
];
```

### 4. Schedule Commands (Kernel.php)
```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('alerts:generate-expired-medicines')
        ->dailyAt('01:00');
}
```

### 5. Configure File Storage (.env)
```env
FILESYSTEM_DISK=local
```

---

## Database Tables Summary

### expired_medicine_alerts
- id (Primary Key)
- medicine_id (Foreign Key → medicines)
- alert_type (CRITICAL, WARNING, INFO)
- status (PENDING, ACKNOWLEDGED, RESOLVED, DISMISSED)
- expiry_date (date)
- days_until_expiry (int)
- notes (text)
- timestamps

### audit_logs
- id (Primary Key)
- user_id (Foreign Key → users)
- action (CREATE, READ, UPDATE, DELETE, EXPORT, LOGIN, LOGOUT)
- module (string)
- description (text)
- old_value (json)
- new_value (json)
- ip_address (string)
- user_agent (text)
- timestamps

### reports
- id (Primary Key)
- user_id (Foreign Key → users)
- type (MEDICINE, SALES, STOCK, AUDIT_LOG, PURCHASE_ORDER)
- filters (json)
- file_path (string)
- generated_at (datetime)
- timestamps

---

## Authorization

### Sprint 5 (Expired Medicine Monitoring)
- Role: ADMIN, OWNER, APOTEKER
- Permission: View, acknowledge, resolve, dismiss alerts

### Sprint 6 (Dashboard Analytics)
- Role: ADMIN, OWNER, APOTEKER
- Permission: View dashboard

### Sprint 7 (Audit Log System)
- Role: ADMIN, OWNER
- Permission: View all audit logs

### Sprint 8 (Reporting & Export)
- Role: ADMIN, OWNER, APOTEKER
- Permission: Generate & download reports

---

## Next Steps

1. ✅ Semua file sudah dibuat
2. ⏳ Run migrations: `php artisan migrate`
3. ⏳ Install export dependencies: `composer require maatwebsite/excel dompdf/dompdf`
4. ⏳ Implement export methods di ReportService
5. ⏳ Register middleware di Kernel.php
6. ⏳ Setup scheduler untuk alerts
7. ⏳ Test endpoints dengan Postman/Insomnia

---

## Notes

- Semua file sudah mengikuti struktur yang konsisten dengan project
- Authentication menggunakan Laravel Sanctum
- Authorization berbasis role
- Pagination default: 15-20 items per page
- All timestamps dalam UTC

---

Generated: 2026-06-09
