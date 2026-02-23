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
        // Currently focused on DISC as requested, but can be filtered
        $questions = PsychotestQuestion::orderBy('session_number')
            ->orderBy('section_number')
            ->orderBy('question_number')
            ->get();

        return Inertia::render('psychotest/questions/index', [
            'questions' => $questions
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
            'question_number' => 'required|integer',
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
            'question_number' => 'required|integer',
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
}
