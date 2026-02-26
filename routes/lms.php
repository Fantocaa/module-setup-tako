<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'menu.permission'])->group(function () {
    Route::get('/courses-index', [CourseController::class, 'indexCrud'])->name('lms.index');
    Route::get('/history', [LessonController::class, 'history'])->name('lms.history');
    Route::post('/courses/{course}/lessons/reorder', [LessonController::class, 'reorder'])->name('courses.lessons.reorder');
    Route::post('/lessons/{lesson}/progress', [LessonController::class, 'updateProgress'])->name('lessons.progress.update');
    Route::get('/lessons/{lesson}/pdf', [LessonController::class, 'streamPdf'])->name('lessons.pdf.stream');
    Route::get('/watch-later', [CourseController::class, 'watchLaterIndex'])->name('lms.watch-later');
    Route::post('/courses/{course}/watch-later', [CourseController::class, 'toggleWatchLater'])->name('courses.watch-later.toggle');
    Route::resource('courses', CourseController::class);
    Route::resource('courses.lessons', LessonController::class);
    Route::resource('tags', TagController::class);
});
