<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Position;
use App\Models\Tag;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $user = auth()->user();
        
        $visibilityConstraints = function ($q) use ($user) {
            $q->where('is_published', true);
            
            if ($user->position_id) {
                // If user has a position, strictly filter by that position (even for Admin)
                $q->whereHas('positions', function ($positionQuery) use ($user) {
                    $positionQuery->where('positions.id', $user->position_id);
                });
            } elseif (!$user->hasRole('Admin')) {
                // User has no position and is not Admin, show no courses
                $q->whereRaw('1 = 0');
            }
            // Fallback: Admin with no position_id can see all published courses
        };

        $query = Course::query()
            ->with(['tags', 'instructor'])
            ->where($visibilityConstraints);

        // Filter by tag
        if ($request->filled('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        // Force clear cache for testing/visibility
        Cache::tags(['courses'])->flush();

        $cacheKey = 'courses:index:' . md5(json_encode([
            'user_id' => $user->id,
            'tag' => $request->tag,
            'search' => $request->search,
            'page' => $request->get('page', 1)
        ]));

        $data = Cache::tags(['courses'])->remember($cacheKey, 3600, function() use ($query, $visibilityConstraints) {
            $courses = $query->latest()->paginate(12)->withQueryString();
            $tags = Tag::whereHas('courses', $visibilityConstraints)->orderBy('name')->get();
            
            return compact('courses', 'tags');
        });

        return Inertia::render('courses/index', [
            'courses' => $data['courses'],
            'tags' => $data['tags'],
            'filters' => [
                'tag' => $request->tag,
                'search' => $request->search,
            ],
        ]);
    }

    public function indexCrud(Request $request): Response
    {
        $query = Course::query()
            ->with(['instructor', 'positions'])
            ->when(!$request->user()->hasRole('Admin'), function ($q) {
                // $q->where('instructor_id', $request->user()->id);
            })
            ->latest();

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%")
                    ->orWhereHas('positions', function ($pq) use ($search) {
                        $pq->where('name', 'ilike', "%{$search}%");
                    });
            });
        }
        
        // Filter by position
        if ($request->filled('position_id')) {
            $query->whereHas('positions', function ($q) use ($request) {
                $q->where('positions.id', $request->position_id);
            });
        }

        // Filter by status if needed
        if ($request->filled('status')) {
             if ($request->status === 'published') {
                 $query->where('is_published', true);
             } elseif ($request->status === 'draft') {
                 $query->where('is_published', false);
             }
        }

        $courses = $query->paginate(12)->withQueryString();

        return Inertia::render('courses/index-crud', [
            'courses' => $courses,
            'positions' => Position::orderBy('name')->get(),
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'position_id' => $request->position_id,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('courses/create', [
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseRequest $request)
    {
        $validated = $request->validated();
        
        // Set instructor_id to current user
        $validated['instructor_id'] = auth()->id();

        $course = Course::create($validated);

        // Attach tags if provided
        if (isset($validated['tags'])) {
            $course->tags()->sync($validated['tags']);
        }

        return redirect()->route('lms.index')
            ->with('success', 'Course created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course): Response
    {
        $course = Cache::tags(['courses'])->remember("course:slug:{$course->slug}", 3600, function() use ($course) {
            return $course->load(['lessons' => function ($query) {
                $query->where('is_published', true)->orderBy('order');
            }, 'tags', 'instructor']);
        });

        $userProgress = auth()->user()->lessonProgress()
            ->whereIn('lesson_id', $course->lessons->pluck('id'))
            ->get()
            ->keyBy('lesson_id');

        $lessonsWithProgress = $course->lessons->map(function ($lesson) use ($userProgress) {
            $progress = $userProgress->get($lesson->id);
            return array_merge($lesson->toArray(), [
                'completed_at' => $progress?->completed_at,
            ]);
        });

        return Inertia::render('courses/[slug]', [
            'course' => $course,
            'lessons' => $lessonsWithProgress,
            'isWatchLater' => auth()->user()->watchLaterCourses()->where('course_id', $course->id)->exists(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course): Response
    {
        $course->load('tags');
        $lessons = $course->lessons()->orderBy('order')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('courses/edit', [
            'course' => $course,
            'lessons' => $lessons,
            'tags' => $tags,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseRequest $request, Course $course)
    {
        $validated = $request->validated();

        $course->update($validated);

        // Sync tags if provided
        if (isset($validated['tags'])) {
            $course->tags()->sync($validated['tags']);
        }

        return back()->with('success', 'Course updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $course->delete();

        return redirect()->route('lms.index')
            ->with('success', 'Course deleted successfully.');
    }

    /**
     * Toggle watch later status for a course.
     */
    public function toggleWatchLater(Course $course)
    {
        $user = auth()->user();
        $status = $user->watchLaterCourses()->toggle($course->id);
        
        $added = count($status['attached']) > 0;
        
        return back()->with('success', $added ? 'Ditambahkan ke daftar Tonton Nanti' : 'Dihapus dari daftar Tonton Nanti');
    }

    /**
     * Display watch later courses list.
     */
    public function watchLaterIndex()
    {
        $user = auth()->user();
        $courses = $user->watchLaterCourses()
            ->with(['tags', 'instructor'])
            ->latest('watch_later.created_at')
            ->paginate(12);

        return Inertia::render('watch-later/index', [
            'courses' => $courses,
        ]);
    }
}
