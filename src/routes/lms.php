<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'menu.permission'])->group(function () {
    Route::get('/courses-index', [CourseController::class, 'indexCrud'])->name('lms.index');
    Route::post('/courses/{course}/lessons/reorder', [LessonController::class, 'reorder'])->name('courses.lessons.reorder');
    Route::post('/lessons/{lesson}/progress', [LessonController::class, 'updateProgress'])->name('lessons.progress.update');
    Route::resource('courses', CourseController::class);
    Route::resource('courses.lessons', LessonController::class);
    Route::resource('tags', TagController::class);
});
