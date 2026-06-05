<?php

use App\Enums\UserRole;

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