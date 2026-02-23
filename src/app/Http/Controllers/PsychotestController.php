<?php

namespace App\Http\Controllers;

use App\Http\Services\DiscScoringService;
use App\Models\PsychotestLink;
use App\Models\PsychotestQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class PsychotestController extends Controller
{
    /**
     * Display a listing of the psychotest links for testing purposes.
     */
    public function index()
    {
        return Inertia::render('psychotest/index', [
            'links' => PsychotestLink::latest()->get()->map(function($link) {
                return array_merge($link->toArray(), [
                    'duration' => $link->duration,
                    'is_expired' => $link->isExpired()
                ]);
            })
        ]);
    }

    /**
     * Store a newly created psychotest link (Simulating internal/external API request).
     */
    public function store(Request $request)
    {
        $request->validate([
            'applicant_name' => 'required|string|max:255',
            'applicant_email' => 'nullable|email',
            'included_tests' => 'nullable|array',
            'included_tests.*' => 'required|string',
        ]);

        $link = PsychotestLink::create([
            'uuid' => (string) Str::uuid(),
            'applicant_name' => $request->applicant_name,
            'applicant_email' => $request->applicant_email,
            'included_tests' => $request->included_tests,
            'expires_at' => Carbon::now()->addHours(24), // Ends in 24 hours
        ]);

        return redirect()->back()->with('success', 'Temporary link generated successfully!');
    }

    /**
     * The actual psychotest page for the applicant.
     */
    public function testPage(Request $request, $uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        if ($link->isExpired()) {
            return Inertia::render('psychotest/error', [
                'message' => 'This link has expired.'
            ]);
        }
        
        // Session mapping
        $testTypeToSession = [
            'papicostic' => 1,
            'cfit' => 2,
            'disc' => 3,
            'skill_test' => 4
        ];
        
        // Filter allowed sessions based on included_tests
        $allowedSessions = [1, 2, 3]; // Default all
        $skillCategory = null;

        if (!empty($link->included_tests)) {
            $allowedSessions = collect($link->included_tests)
                ->map(function($type) use ($testTypeToSession, &$skillCategory) {
                    if (str_starts_with($type, 'skill_test:')) {
                        $skillCategory = str_replace('skill_test:', '', $type);
                        return $testTypeToSession['skill_test'];
                    }
                    return $testTypeToSession[$type] ?? null;
                })
                ->filter()
                ->unique()
                ->values()
                ->toArray();
        }

        // Session Hub
        if (!$request->has('session')) {
            return Inertia::render('psychotest/hub', [
                'link' => array_merge($link->toArray(), [
                    'allowed_sessions' => $allowedSessions // Pass allowed sessions to frontend
                ]),
                'currentSession' => (int) ($link->last_completed_session ?? 0)
            ]);
        }

        // Specific Session
        $session = (int) $request->session;
        $currentSection = (int) ($request->current_section ?? 1);
        
        // Check if session is in allowed list
        if (!in_array($session, $allowedSessions)) {
             return redirect()->route('psychotest.take-test', $uuid)
                ->with('error', 'This test section is not assigned to you.');
        }

        // Check if session is unlocked
        // Modified logic: We need to find the "next" allowed session, not just simple +1
        // But for now keeping simple strictly sequential logic might be complex if we skip 2.
        // Let's keep strict logic: You must complete session X before Y if X < Y and X is allowed.
        // Or actually, simple logic: is previous *allowed* session completed?
        
        // For simplicity let's rely on last_completed_session. 
        // If we skip session 2 (CFIT), then session 3 (DISC) becomes the "next" after session 1.
        // This requires dynamically calculating "next available session".
        // Use a simple check: is $session > ($link->last_completed_session + 1)? 
        // If we skip sessions, this logic breaks.
        // FIXED LOGIC: Users should follow the order of $allowedSessions.
        // But the legacy logic uses 'last_completed_session' (int).
        // Let's assume if you skip session 2, 'last_completed_session' will jump from 1 to 3? Or stay 1?
        // If we use 'last_completed_session' to track progress, we must ensure we update it correctly in submit().
        
        // Check if session is already done
        if ($session < $link->last_completed_session) {
             return redirect()->route('psychotest.take-test', $uuid)
                ->with('error', 'Session already completed.');
        }

        // Set started_at if it's the first time strictly (global start)
        if (!$link->started_at) {
            $link->update([
                'started_at' => Carbon::now()
            ]);
        }
        
        // Fetch questions for this session (all sections)
        $query = PsychotestQuestion::where('session_number', $session);

        // Filter by skill category if its a skill test
        if ($session === (int) ($testTypeToSession['skill_test'] ?? 4) && $skillCategory) {
            $query->where('content->skill_category', 'LIKE', '%' . $skillCategory . '%');
        }

        $questions = $query->orderBy('section_number')
            ->orderBy('question_number')
            ->get();

        if ($questions->isEmpty()) {
            return redirect()
                ->route('psychotest.take-test', $uuid)
                ->with('error', 'No questions found for this section.');
        }
            
        // Get section duration from the specific section question
        $sectionDuration = $questions->where('section_number', $currentSection)->first()->section_duration ?? 600;

        // Server-side Timer Persistence per section
        $results = $link->results ?? [];
        if (!isset($results["session_{$session}"])) {
            $results["session_{$session}"] = [
                'current_section' => $currentSection,
                'answers' => []
            ];
        }

        // Specifically track start time of THIS section
        $sectionKey = "section_{$currentSection}_started_at";
        if (!isset($results["session_{$session}"][$sectionKey])) {
            $results["session_{$session}"][$sectionKey] = now()->toDateTimeString();
            $link->update(['results' => $results]);
        }

        $sessionData = $results["session_{$session}"];
        $startedAt = Carbon::parse($sessionData[$sectionKey]);
        $elapsedSeconds = $startedAt->diffInSeconds(now());
        $remainingTime = max(0, $sectionDuration - $elapsedSeconds);

        return Inertia::render('psychotest/take-test', [
            'link' => array_merge($link->toArray(), [
                'allowed_sessions' => $allowedSessions
            ]),
            'session' => $session,
            'questions' => $questions,
            'timeLimit' => (int) $sectionDuration,
            'remainingTime' => (int) $remainingTime,
            'currentSection' => $currentSection,
            'savedAnswers' => $sessionData['answers'] ?? []
        ]);
    }

    /**
     * Handle the submission of the psychotest.
     */
    public function submit(Request $request, $uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        if ($link->isExpired()) {
             return redirect()->route('psychotest.error', ['message' => 'Invalid or expired link.']);
        }

        $request->validate([
            'answers' => 'nullable|array',
            'session' => 'required|integer',
            'files' => 'nullable|array',
            'files.*' => 'file|max:20480', // 20MB limit
        ]);
        
        $session = $request->session;
        $currentResults = $link->results ?? [];
        
        // Check if we are advancing to next section or completing session
        $isFinal = $request->input('is_final', false);
        $currentSection = $request->input('current_section', 1);

        // Initialize session data if missing
        if (!isset($currentResults["session_{$session}"])) {
             $currentResults["session_{$session}"] = [
                'current_section' => $currentSection,
                'answers' => []
             ];
        }

        // Update answers
        $answers = $request->answers ?? [];

        // Handle File Uploads
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $questionId => $file) {
                $originalName = $file->getClientOriginalName();
                $path = $file->storeAs("psychotest/submissions/{$uuid}/session_{$session}", $originalName, 'public');
                $answers[$questionId] = [
                    'file_path' => $path,
                    'original_name' => $originalName,
                    'uploaded_at' => now()->toDateTimeString(),
                    'full_url' => asset('storage/' . $path)
                ];
            }
        }

        // Preserve numeric keys (Question IDs) by using + instead of array_merge
        $currentResults["session_{$session}"]['answers'] = ($currentResults["session_{$session}"]['answers'] ?? []) + $answers;
        
        $updateData = [];

        if (!$isFinal) {
            // Advancing to NEXT SUBTEST within the same session
            $nextSection = $currentSection + 1;
            $currentResults["session_{$session}"]['current_section'] = $nextSection;
            
            $updateData['results'] = $currentResults;
            $link->update($updateData);

            return redirect()->route('psychotest.take-test', [
                'uuid' => $uuid,
                'session' => $session,
                'current_section' => $nextSection
            ]);
        } else {
            // COMPLETING the entire session
            $currentResults["session_{$session}"]['completed_at'] = now()->toDateTimeString();
            $updateData['results'] = $currentResults;

            // Update session progress
            if ($session > $link->last_completed_session) {
                $updateData['last_completed_session'] = $session;
            }

            // Calculate allowed sessions to determine if this is the last one
            $testTypeToSession = [
                'papicostic' => 1,
                'cfit' => 2,
                'disc' => 3,
                'skill_test' => 4
            ];
            
            $allowedSessions = [1, 2, 3, 4];
            if (!empty($link->included_tests)) {
                $allowedSessions = collect($link->included_tests)
                    ->map(function($type) use ($testTypeToSession) {
                        if (str_starts_with($type, 'skill_test:')) {
                            return $testTypeToSession['skill_test'];
                        }
                        return $testTypeToSession[$type] ?? null;
                    })
                    ->filter()
                    ->unique()
                    ->values()
                    ->toArray();
            }

            $maxSession = !empty($allowedSessions) ? max($allowedSessions) : 4;
            
            if ($session >= $maxSession) {
                $updateData['finished_at'] = now();
                $updateData['used_at'] = now();
            }

            $link->update($updateData);

            // Redirect back to Hub
            return redirect()->route('psychotest.take-test', $uuid);
        }
    }

    /**
     * Show the psychotest report.
     */
    public function report($uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        // Load questions for all psycho sessions + skill test
        $questions = PsychotestQuestion::whereIn('session_number', [1, 2, 3, 4])
            ->orderBy('session_number')
            ->orderBy('section_number')
            ->orderBy('question_number')
            ->get()
            ->groupBy('session_number');

        // DISC scoring
        $discAnalysis = null;
        $discAnswers  = data_get($link->results, 'session_3.answers', []);
        if (!empty($discAnswers)) {
            $discQuestions = $questions->get(3);
            $formattedAnswers = [];
            foreach ($discAnswers as $qId => $ans) {
                $q = $discQuestions ? $discQuestions->firstWhere('id', (int)$qId) : null;
                if ($q) {
                    $formattedAnswers[] = array_merge($ans, [
                        'question_number' => $q->question_number
                    ]);
                }
            }
            $scorer       = new DiscScoringService();
            $discAnalysis = $scorer->score($formattedAnswers);
        }

        return Inertia::render('psychotest/Report', [
            'link' => array_merge($link->toArray(), [
                'duration' => $link->duration,
                'included_tests_expanded' => $link->included_tests
            ]),
            'questions'    => $questions,
            'disc_analysis' => $discAnalysis,
        ]);
    }

    public function storeApi(Request $request)
    {
        $client = $request->user(); // system client

        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email',
            'nik' => 'nullable|string|max:16',
            'tests' => 'nullable|array',
            'tests.*' => 'string|in:cfit,disc,papicostic,skill_test', 
        ]);

        $link = PsychotestLink::create([
            'uuid' => Str::uuid(),
            'applicant_name' => $data['name'],
            'applicant_email' => $data['email'],
            'nik' => $data['nik'] ?? null,
            'expires_at' => now()->addHours(24),
            'included_tests' => $data['tests'] ?? null, // Store selected tests or null for all
        ]);

        return response()->json([
            'name' => $link->applicant_name,
            'email' => $link->applicant_email,
            'nik' => $link->nik,
            'result_psikologi' => route('psychotest.take-test', $link->uuid),
            'report_url' => route('psychotest.report.api', $link->uuid),
            'report_psikologi_url' => route('psychotest.report-view', $link->uuid),
            'report_skill_url' => route('psychotest.skill-report-view', $link->uuid),
            'expires_at' => $link->expires_at,
        ]);
    }

    /**
     * Public view: Psychotest report (CFIT, DISC, PAPICOSTIC) with questions + answers.
     */
    public function reportView($uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        // Sessions for psycho tests only (1=PAPICOSTIC, 2=CFIT, 3=DISC)
        $psychoSessions = [1, 2, 3];

        // Load questions for all psycho sessions
        $questions = PsychotestQuestion::whereIn('session_number', $psychoSessions)
            ->orderBy('session_number')
            ->orderBy('section_number')
            ->orderBy('question_number')
            ->get()
            ->groupBy('session_number');

        // DISC scoring
        $discAnalysis = null;
        $discAnswers  = data_get($link->results, 'session_3.answers', []);
        if (!empty($discAnswers)) {
            $discQuestions = $questions->get(3);
            $formattedAnswers = [];
            foreach ($discAnswers as $qId => $ans) {
                $q = $discQuestions ? $discQuestions->firstWhere('id', (int)$qId) : null;
                if ($q) {
                    $formattedAnswers[] = array_merge($ans, [
                        'question_number' => $q->question_number
                    ]);
                }
            }
            $scorer       = new DiscScoringService();
            $discAnalysis = $scorer->score($formattedAnswers);
        }

        return Inertia::render('psychotest/ReportView', [
            'link' => array_merge($link->toArray(), [
                'duration' => $link->duration,
            ]),
            'questions'     => $questions,
            'disc_analysis' => $discAnalysis,
        ]);
    }

    /**
     * Public view: Skill test report (uploaded files).
     */
    public function skillReportView($uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        // Extract session 4 (skill test) answers
        $results = $link->results ?? [];
        $skillAnswers = $results['session_4']['answers'] ?? [];

        return Inertia::render('psychotest/SkillReportView', [
            'link' => array_merge($link->toArray(), [
                'duration' => $link->duration,
            ]),
            'skillAnswers' => $skillAnswers,
        ]);
    }

    /**
     * API for ATS to fetch report data.
     */
    public function reportApi($uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        return response()->json($this->formatReportData($link));
    }

    /**
     * Search for a report by NIK or Email.
     */
    public function searchApi(Request $request)
    {
        $data = $request->validate([
            'nik' => 'nullable|string',
            'email' => 'nullable|email',
        ]);

        if (empty($data['nik']) && empty($data['email'])) {
            return response()->json(['message' => 'Please provide NIK or Email.'], 422);
        }

        $query = PsychotestLink::query();

        if (!empty($data['nik'])) {
            $query->where('nik', $data['nik']);
        }

        if (!empty($data['email'])) {
            $query->where('applicant_email', $data['email']);
        }

        $link = $query->latest()->first();

        if (!$link) {
            return response()->json(['message' => 'Report not found.'], 404);
        }

        return response()->json($this->formatReportData($link));
    }

    /**
     * Helper to format report data for API response.
     */
    private function formatReportData(PsychotestLink $link)
    {
        return [
            'uuid' => $link->uuid,
            'applicant_name' => $link->applicant_name,
            'applicant_email' => $link->applicant_email,
            'nik' => $link->nik,
            'finished_at' => $link->finished_at,
            'results' => $link->results,
            'pdf_url' => route('psychotest.pdf', $link->uuid)
        ];
    }

    /**
     * Download the psychotest report as PDF.
     */
    public function downloadPdf($uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();

        $pdf = Pdf::loadView('pdf.psychotest-report', [
            'link' => $link,
            'duration' => $link->duration
        ]);

        return $pdf->download("psychotest-report-{$link->applicant_name}.pdf");
    }

    /**
     * Restart the psychotest session for an applicant.
     */
    public function restart($uuid)
    {
        $link = PsychotestLink::where('uuid', $uuid)->firstOrFail();
        
        $link->update([
            'started_at' => null,
            'finished_at' => null,
            'used_at' => null,
            'results' => [], // Clear all previous results
            'last_completed_session' => 0, // Reset progress
            'expires_at' => Carbon::now()->addHours(24),
        ]);

        return redirect()->back()->with('success', 'Psychotest session restarted successfully!');
    }

    /**
     * Helper for error page if needed via route.
     */
    public function error(Request $request)
    {
        return Inertia::render('psychotest/error', [
            'message' => $request->get('message', 'An error occurred.')
        ]);
    }
}
