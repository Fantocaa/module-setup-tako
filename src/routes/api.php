<?php

use App\Http\Controllers\AuthTokenController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PsychotestController;

Route::post('/auth/token', [AuthTokenController::class, 'issue']);

Route::middleware('auth:api')->group(function () {
    Route::post('/psychotest/store', [PsychotestController::class, 'storeApi'])->name('api.psychotest.store');
    Route::get('/psychotest/report/{uuid}', [PsychotestController::class, 'reportApi'])->name('psychotest.report.api');
    Route::post('/psychotest/report/search', [PsychotestController::class, 'searchApi'])->name('psychotest.report.search');
});
