<?php

use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\BackupController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PositionController;
use App\Http\Controllers\PsychotestController;
use App\Http\Controllers\PsychotestQuestionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
// use Laravel\Fortify\Features;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified', 'menu.permission'])->group(function () {
    Route::get('dashboard', function () {
        if (auth()->user()->hasRole('user')) {
            return redirect()->route('courses.index');
        }
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/profile', [UserProfileController::class, 'edit'])->name('user.profile.edit');
    Route::patch('/profile', [UserProfileController::class, 'update'])->name('user.profile.update');
    Route::put('/profile/password', [UserProfileController::class, 'updatePassword'])->name('user.profile.password.update');
    Route::delete('/profile', [UserProfileController::class, 'destroy'])->name('user.profile.destroy');
    
    Route::resource('transactions', TransactionController::class);
    Route::resource('roles', RoleController::class);
    Route::resource('positions', PositionController::class);
    Route::resource('permissions', PermissionController::class);
    Route::resource('users', UserController::class);
    Route::put('/users/{user}/reset-password', [UserController::class, 'resetPassword'])->name('users.reset-password');
    Route::resource('menus', MenuController::class)->except(['create', 'edit']);
    Route::post('menus/reorder', [MenuController::class, 'reorder'])->name('menus.reorder');
    Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    Route::get('/backup', [BackupController::class, 'index'])->name('backup.index');
    Route::post('/backup/run', [BackupController::class, 'run'])->name('backup.run');
    Route::get('/backup/download/{file}', [BackupController::class, 'download'])->name('backup.download');
    Route::delete('/backup/delete/{file}', [BackupController::class, 'delete'])->name('backup.delete');

    // Psychotest Admin/Testing Routes
    Route::get('/psychotest-link', [PsychotestController::class, 'index'])->name('psychotest.index');
    Route::post('/psychotest-link', [PsychotestController::class, 'store'])->name('psychotest.store');
    Route::get('/psychotest-link/{uuid}/report', [PsychotestController::class, 'report'])->name('psychotest.report');
    Route::post('/psychotest-link/{uuid}/restart', [PsychotestController::class, 'restart'])->name('psychotest.restart');
    
    // Psychotest Questions CRUD
    Route::resource('psychotest-questions', PsychotestQuestionController::class);
    Route::post('/psychotest-sections', [PsychotestQuestionController::class, 'storeSection'])->name('psychotest-sections.store');
    Route::delete('/psychotest-sections/{section}', [PsychotestQuestionController::class, 'destroySection'])->name('psychotest-sections.destroy');
});

Route::get('/psychotest-link/{uuid}/pdf', [PsychotestController::class, 'downloadPdf'])->name('psychotest.pdf');

// Applicant Psychotest Routes (Public)
Route::get('/psychotest/error', [PsychotestController::class, 'error'])->name('psychotest.error');
Route::get('/psychotest/{uuid}', [PsychotestController::class, 'testPage'])->name('psychotest.take-test');
Route::post('/psychotest/{uuid}/submit', [PsychotestController::class, 'submit'])->name('psychotest.submit');

// Public Report View Routes (for ATS links)
Route::get('/psychotest/{uuid}/report-view', [PsychotestController::class, 'reportView'])->name('psychotest.report-view');
Route::get('/psychotest/{uuid}/skill-report-view', [PsychotestController::class, 'skillReportView'])->name('psychotest.skill-report-view');

require __DIR__ . '/settings.php';
require __DIR__ . '/lms.php';
