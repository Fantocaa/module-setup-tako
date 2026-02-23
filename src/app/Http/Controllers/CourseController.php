<?php

namespace App\Http\Controllers;

use App\Models\Course;
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
        
        $query = Course::query()
            ->with(['tags', 'instructor'])
            ->where(function ($q) use ($user) {
                $q->where('is_published', true);
                
                // If user is not Admin, only show courses assigned to their position
                if (!$user->hasRole('Admin')) {
                    if ($user->position_id) {
                        $q->whereHas('positions', function ($positionQuery) use ($user) {
                            $positionQuery->where('positions.id', $user->position_id);
                        });
                    } else {
                        // User has no position, show no courses
                        $q->whereRaw('1 = 0');
                    }
                }
            });

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
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $cacheKey = 'courses:index:' . md5(json_encode([
            'user_id' => $user->id,
            'tag' => $request->tag,
            'search' => $request->search,
            'page' => $request->get('page', 1)
        ]));

        $data = Cache::tags(['courses'])->remember($cacheKey, 3600, function() use ($query, $request) {
            $courses = $query->latest()->paginate(12)->withQueryString();
            $tags = Tag::orderBy('name')->get();
            
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
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
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
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
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

        return Inertia::render('courses/[slug]', [
            'course' => $course,
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
}
