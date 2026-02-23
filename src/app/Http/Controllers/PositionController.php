<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $positions = Position::with('courses')->withCount('users')->get();
        $courses = Course::orderBy('title')->get(['id', 'title']);

        return Inertia::render('positions/Index', [
            'positions' => $positions,
            'courses' => $courses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|unique:positions,name',
            'description' => 'nullable|string',
            'courses' => 'array',
        ]);

        $position = Position::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
        ]);

        // Sync courses
        if (isset($data['courses'])) {
            $position->courses()->sync($data['courses']);
        }

        return redirect()->route('positions.index')->with('success', 'Position created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Position $position)
    {
        $data = $request->validate([
            'name' => 'required|unique:positions,name,' . $position->id,
            'description' => 'nullable|string',
            'courses' => 'array',
        ]);

        $position->update([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
        ]);

        // Sync courses
        if (isset($data['courses'])) {
            $position->courses()->sync($data['courses']);
        }

        return redirect()->route('positions.index')->with('success', 'Position updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Position $position)
    {
        $position->delete();
        return redirect()->route('positions.index')->with('success', 'Position deleted successfully');
    }
}
