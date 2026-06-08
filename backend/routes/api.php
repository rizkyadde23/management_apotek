<?php

use App\Enums\UserRole;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\MedicineCategoryController;
use App\Http\Controllers\Api\V1\SupplierController;
use App\Http\Controllers\Api\V1\RoleController;
use App\Http\Controllers\Api\V1\MedicineController;
use App\Http\Controllers\Api\V1\StockLogController;

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
