<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Http\Requests\StoreLessonRequest;
use App\Http\Requests\UpdateLessonProgressRequest;
use App\Http\Requests\UpdateLessonRequest;
use App\Models\LessonProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LessonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Course $course): Response
    {
        $lessons = Cache::tags(['courses'])->remember("course_lessons_all:{$course->id}", now()->addHours(24), function () use ($course) {
            return $course->lessons()->ordered()->get();
        });

        return Inertia::render('courses/[slug]/lessons/index', [
            'course' => $course,
            'lessons' => $lessons,
        ]);
    }
    /**
     * Display a listing of the user's lesson progress (history).
     */
    public function history(): Response
    {
        $user = auth()->user();
        
        $history = LessonProgress::where('user_id', $user->id)
            ->with(['lesson', 'lesson.course'])
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($progress) {
                return [
                    'id' => $progress->id,
                    'lesson_id' => $progress->lesson_id,
                    'lesson_title' => $progress->lesson->title,
                    'lesson_slug' => $progress->lesson->slug,
                    'course_title' => $progress->lesson->course->title,
                    'course_slug' => $progress->lesson->course->slug,
                    'completed_at' => $progress->completed_at,
                    'last_position' => $progress->last_position,
                    'updated_at' => $progress->updated_at,
                    'duration' => $progress->lesson->duration,
                ];
            });

        return Inertia::render('history/index', [
            'history' => $history,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Course $course): Response
    {
        return Inertia::render('courses/[slug]/lessons/create', [
            'course' => $course,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLessonRequest $request, Course $course)
    {
        $validated = $request->validated();
        
        // Set course_id
        $validated['course_id'] = $course->id;

        // Auto-increment order if not provided
        if (!isset($validated['order'])) {
            $maxOrder = $course->lessons()->max('order') ?? 0;
            $validated['order'] = $maxOrder + 1;
        }

        // Handle File Upload
        if ($request->hasFile('video_file')) {
            $path = $request->file('video_file')->store('course/lessons', 'public');
            $validated['video_path'] = $path;
            $validated['video_url'] = null; // Clear URL if file is uploaded
        }

        // Handle PDF Upload
        if ($request->hasFile('pdf_file')) {
            $path = $request->file('pdf_file')->store('course/lessons', 'public');
            $validated['pdf_path'] = $path;
        }


        $lesson = Lesson::create($validated);

        return redirect()->route('courses.edit', $course)
            ->with('success', 'Lesson created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course, string $lessonSlug): Response
    {
        $lessons = Cache::tags(['courses'])->remember("course_lessons_published:{$course->id}", now()->addHours(24), function () use ($course) {
            return $course->lessons()->where('is_published', true)->orderBy('order')->get();
        });

        // Find lesson by slug (title converted to slug)
        // We support both ID and slug for backwards compatibility or internal links
        $lesson = $lessons->first(function ($l) use ($lessonSlug) {
            return $l->slug === $lessonSlug || (is_numeric($lessonSlug) && $l->id == $lessonSlug);
        });

        if (!$lesson) {
            abort(404);
        }

        $currentIndex = $lessons->search(fn($l) => $l->id === $lesson->id);
        
        $prevLesson = $currentIndex > 0 ? $lessons[$currentIndex - 1] : null;
        $nextLesson = $currentIndex < $lessons->count() - 1 ? $lessons[$currentIndex + 1] : null;

        // Fetch user progress for all lessons in this course
        $userProgress = LessonProgress::where('user_id', auth()->id())
            ->whereIn('lesson_id', $lessons->pluck('id'))
            ->get()
            ->keyBy('lesson_id');

        return Inertia::render('courses/[slug]/lessons/[id]', [
            'course' => $course,
            'lesson' => $lesson,
            'lessons' => $lessons->map(function ($l) use ($userProgress) {
                $progress = $userProgress->get($l->id);
                return array_merge($l->toArray(), [
                    'completed_at' => $progress?->completed_at,
                    'last_position' => $progress?->last_position,
                ]);
            }),
            'currentLessonProgress' => $userProgress->get($lesson->id),
            'prevLesson' => $prevLesson,
            'nextLesson' => $nextLesson,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course, Lesson $lesson): Response
    {
        return Inertia::render('courses/[slug]/lessons/edit', [
            'course' => $course,
            'lesson' => $lesson,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLessonRequest $request, Course $course, Lesson $lesson)
    {
        $validated = $request->validated();

        // Handle File Upload
        if ($request->hasFile('video_file')) {
            // Delete old file if exists
            if ($lesson->video_path && Storage::disk('public')->exists($lesson->video_path)) {
                Storage::disk('public')->delete($lesson->video_path);
            }
            
            $path = $request->file('video_file')->store('course/lessons', 'public');
            $validated['video_path'] = $path;
            $validated['video_url'] = null; // Clear URL if file is uploaded
        } elseif (isset($validated['video_url']) && $validated['video_url']) {
             // User provided a URL, meaning they might have switched from File to URL.
             // We should delete existing file if it exists.
             if ($lesson->video_path && Storage::disk('public')->exists($lesson->video_path)) {
                Storage::disk('public')->delete($lesson->video_path);
            }
            $validated['video_path'] = null;
        }

        // Handle PDF Upload
        if ($request->hasFile('pdf_file')) {
            // Delete old file if exists
            if ($lesson->pdf_path && Storage::disk('public')->exists($lesson->pdf_path)) {
                Storage::disk('public')->delete($lesson->pdf_path);
            }
            
            $path = $request->file('pdf_file')->store('course/lessons', 'public');
            $validated['pdf_path'] = $path;
        }

        $lesson->update($validated);

        return redirect()->route('courses.edit', $course)
            ->with('success', 'Lesson updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course, Lesson $lesson)
    {
        $deletedOrder = $lesson->order;
        $lesson->delete();

        // Reorder remaining lessons
        $course->lessons()
            ->where('order', '>', $deletedOrder)
            ->decrement('order');

        return redirect()->route('courses.show', $course)
            ->with('success', 'Lesson deleted successfully.');
    }

    public function reorder(Request $request, Course $course)
    {
        $request->validate([
            'lessons' => 'required|array',
            'lessons.*.id' => 'required|exists:lessons,id',
            'lessons.*.order' => 'required|integer',
        ]);

        foreach ($request->lessons as $item) {
            Lesson::where('id', $item['id'])
                ->where('course_id', $course->id)
                ->update(['order' => $item['order']]);
        }

        $course->clearInstanceCache();

        return redirect()->back()->with('success', 'Lesson order updated successfully.');
    }

    public function updateProgress(UpdateLessonProgressRequest $request, string $lessonSlug)
    {
        $user = auth()->user();
        
        // Find lesson by slug or ID
        $lesson = Lesson::all()->first(function($l) use ($lessonSlug) {
            return $l->slug === $lessonSlug || (is_numeric($lessonSlug) && $l->id == $lessonSlug);
        });

        if (!$lesson) abort(404);

        $progress = LessonProgress::updateOrCreate(
            ['user_id' => $user->id, 'lesson_id' => $lesson->id],
            [
                'last_position' => $request->last_position,
                'completed_at' => $request->is_completed ? now() : null,
            ]
        );

        return response()->json([
            'success' => true,
            'progress' => $progress,
        ]);
    }

    /**
     * Stream a PDF file securely as base64 to avoid extension interception (IDM).
     */
    public function streamPdf(string $lessonSlug): \Illuminate\Http\JsonResponse
    {
        // Find lesson by slug or ID
        $lesson = Lesson::all()->first(function($l) use ($lessonSlug) {
            return $l->slug === $lessonSlug || (is_numeric($lessonSlug) && $l->id == $lessonSlug);
        });

        if (!$lesson || $lesson->content_type !== 'pdf' || !$lesson->pdf_path) {
            abort(404);
        }

        if (!Storage::disk('public')->exists($lesson->pdf_path)) {
            abort(404);
        }

        $fileContent = Storage::disk('public')->get($lesson->pdf_path);
        $base64 = base64_encode($fileContent);

        return response()->json([
            'data' => $base64,
            'mime' => 'application/pdf',
            'name' => basename($lesson->pdf_path)
        ]);
    }

}
