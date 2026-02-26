<?php

namespace App\Http\Controllers;

use App\Models\PsychotestQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PsychotestQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $questions = PsychotestQuestion::orderBy('session_number')
            ->orderBy('section_number')
            ->orderBy('question_number')
            ->get();

        $sections = \App\Models\PsychotestSection::orderBy('session_number')
            ->orderBy('section_number')
            ->get();

        return Inertia::render('psychotest/questions/index', [
            'questions' => $questions,
            'sections' => $sections
        ]);
    }

    /*
    public function create()
    {
        return Inertia::render('psychotest/questions/create');
    }
    */

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'test_type' => 'required|string',
            'session_number' => 'required|integer',
            'section_number' => 'nullable|integer',
            'section_duration' => 'nullable|integer',
            'question_number' => [
                'required',
                'integer',
                \Illuminate\Validation\Rule::unique('psychotest_questions')->where(function ($query) use ($request) {
                    return $query->where('test_type', $request->test_type)
                        ->where('section_number', $request->section_number);
                }),
            ],
            'type' => 'required|string',
            'content' => 'nullable|array',
            'options' => 'nullable|array',
            'correct_answer' => 'nullable|array',
            'template_file' => 'nullable|file|max:10240', // 10MB
        ]);

        $content = $validated['content'] ?? [];

        if ($request->hasFile('template_file')) {
            $path = $request->file('template_file')->store('psychotest/templates', 'public');
            $content['file_path'] = $path;
            $content['file_url'] = asset('storage/' . $path);
        }

        $validated['content'] = $content;

        PsychotestQuestion::create($validated);

        return redirect()->route('psychotest-questions.index')
            ->with('success', 'Question created successfully.');
    }

    public function show(PsychotestQuestion $psychotestQuestion)
    {
        //
    }

    // public function edit(PsychotestQuestion $psychotestQuestion)
    // {
    //    return Inertia::render('psychotest/questions/edit', [
    //         'question' => $psychotestQuestion
    //    ]);
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PsychotestQuestion $psychotestQuestion)
    {
        $validated = $request->validate([
            'test_type' => 'required|string',
            'session_number' => 'required|integer',
            'section_number' => 'nullable|integer',
            'section_duration' => 'nullable|integer',
            'question_number' => [
                'required',
                'integer',
                \Illuminate\Validation\Rule::unique('psychotest_questions')->where(function ($query) use ($request) {
                    return $query->where('test_type', $request->test_type)
                        ->where('section_number', $request->section_number);
                })->ignore($psychotestQuestion->id),
            ],
            'type' => 'required|string',
            'content' => 'nullable|array',
            'options' => 'nullable|array',
            'correct_answer' => 'nullable|array',
            'template_file' => 'nullable|file|max:10240',
        ]);

        $content = array_merge($psychotestQuestion->content ?? [], $validated['content'] ?? []);

        if ($request->hasFile('template_file')) {
            $path = $request->file('template_file')->store('psychotest/templates', 'public');
            $content['file_path'] = $path;
            $content['file_url'] = asset('storage/' . $path);
        }

        $validated['content'] = $content;

        $psychotestQuestion->update($validated);

        return redirect()->route('psychotest-questions.index')
            ->with('success', 'Question updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PsychotestQuestion $psychotestQuestion)
    {
        $psychotestQuestion->delete();

        return redirect()->back()->with('success', 'Question deleted successfully.');
    }

    /**
     * Store or update a psychotest section.
     */
    public function storeSection(Request $request)
    {
        $validated = $request->validate([
            'test_type' => 'required|string',
            'session_number' => 'nullable|integer',
            'section_number' => 'required|integer',
            'duration' => 'required|integer',
            'name' => 'nullable|string|max:255',
        ]);

        \App\Models\PsychotestSection::updateOrCreate(
            [
                'test_type' => $validated['test_type'],
                'section_number' => $validated['section_number'],
            ],
            [
                'session_number' => $validated['session_number'] ?? 1,
                'duration' => $validated['duration'],
                'name' => $validated['name'],
            ]
        );

        return redirect()->back()->with('success', 'Section updated successfully.');
    }

    /**
     * Remove a psychotest section.
     */
    public function destroySection(\App\Models\PsychotestSection $section)
    {
        $section->delete();
        return redirect()->back()->with('success', 'Section deleted successfully.');
    }
}
