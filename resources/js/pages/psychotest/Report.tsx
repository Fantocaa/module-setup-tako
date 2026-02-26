import {
    DiscResultDisplay,
    type DiscAnalysis,
} from '@/components/disc-result-display';
import {
    PapiCosticResultDisplay,
    type PapiAnalysis,
} from '@/components/papi-costic-result-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Circle, Download, Printer } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
    id: number;
    session_number: number;
    section_number: number;
    question_number: number;
    type: string;
    content: {
        text?: string;
        image_url?: string;
        sub_questions?: Array<{
            id: number;
            text?: string;
            image_url?: string;
        }>;
    };
    options: Array<{ id: string; text?: string; image_url?: string }> | null;
}

interface SkillAnswer {
    file_path?: string;
    original_name?: string;
    uploaded_at?: string;
    full_url?: string;
}

interface PsychotestLink {
    id: number;
    uuid: string;
    applicant_name: string;
    applicant_email: string | null;
    nik: string | null;
    expires_at: string;
    used_at: string | null;
    started_at: string | null;
    finished_at: string | null;
    duration: string | null;
    results: Record<string, any> | null;
    included_tests: string[] | null;
}

interface Props {
    link: PsychotestLink;
    questions: Record<string, Question[]>;
    disc_analysis?: DiscAnalysis | null;
    papi_analysis?: PapiAnalysis | null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const SESSION_NAMES: Record<number, string> = {
    1: 'PAPICOSTIC',
    2: 'CFIT',
    3: 'DISC',
    4: 'Skill Test',
};

const SESSION_COLORS: Record<
    number,
    { accent: string; badge: string; selected: string }
> = {
    1: {
        accent: 'text-violet-600',
        badge: 'bg-violet-100 text-violet-700',
        selected: 'border-indigo-400 bg-indigo-50 text-indigo-700',
    },
    2: {
        accent: 'text-sky-600',
        badge: 'bg-sky-100 text-sky-700',
        selected: 'border-sky-400 bg-sky-50 text-sky-700',
    },
    3: {
        accent: 'text-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700',
        selected: 'border-emerald-400 bg-emerald-50 text-emerald-700',
    },
    4: {
        accent: 'text-teal-600',
        badge: 'bg-teal-100 text-teal-700',
        selected: 'border-teal-400 bg-teal-50 text-teal-700',
    },
};

// ─── Question Card ─────────────────────────────────────────────────────────────

function QuestionCard({
    question,
    answer,
    index,
    sessionNum,
}: {
    question: Question;
    answer: any;
    index: number;
    sessionNum: number;
}) {
    const content = question.content ?? {};
    const options = question.options ?? [];
    const colors = SESSION_COLORS[sessionNum] ?? SESSION_COLORS[1];

    const isDisc = sessionNum === 3;
    const discMost = isDisc && answer?.most ? String(answer.most) : null;
    const discLeast = isDisc && answer?.least ? String(answer.least) : null;

    const selectedIds: string[] = isDisc
        ? ([discMost, discLeast].filter(Boolean) as string[])
        : Array.isArray(answer)
          ? answer.map(String)
          : answer != null
            ? [String(answer)]
            : [];

    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {/* Header */}
            <div className="flex items-start gap-3 border-b border-border bg-muted/30 px-5 py-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {index}
                </span>
                <div className="min-w-0 flex-1">
                    {content.text && (
                        <p className="text-sm leading-relaxed font-medium text-foreground">
                            {content.text}
                        </p>
                    )}
                    {content.image_url && (
                        <img
                            src={content.image_url}
                            alt="Question"
                            className="mt-2 max-h-40 w-auto rounded-lg border border-border object-contain"
                        />
                    )}
                    {!content.text && !content.image_url && (
                        <p className="text-sm text-muted-foreground italic">
                            Question #{question.question_number}
                        </p>
                    )}
                </div>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {question.type}
                </span>
            </div>

            {/* Sub-questions */}
            {content.sub_questions && content.sub_questions.length > 0 && (
                <div className="space-y-2 px-5 py-3">
                    {content.sub_questions.map((sq) => {
                        const sqAnswer =
                            answer && typeof answer === 'object'
                                ? answer[String(sq.id)]
                                : undefined;
                        return (
                            <div
                                key={sq.id}
                                className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2"
                            >
                                <span className="mt-0.5 text-xs font-semibold text-muted-foreground">
                                    {sq.id}.
                                </span>
                                <div className="flex-1">
                                    {sq.text && (
                                        <p className="text-sm text-foreground">
                                            {sq.text}
                                        </p>
                                    )}
                                    {sq.image_url && (
                                        <img
                                            src={sq.image_url}
                                            alt=""
                                            className="mt-1 h-10 w-auto object-contain"
                                        />
                                    )}
                                </div>
                                {sqAnswer != null && (
                                    <span
                                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${colors.badge}`}
                                    >
                                        {String(sqAnswer)}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Options */}
            {options.length > 0 && !content.sub_questions?.length && (
                <div className="grid grid-cols-2 gap-2 px-5 py-4 sm:grid-cols-3">
                    {options.map((opt) => {
                        const isSelected = selectedIds.includes(String(opt.id));
                        return (
                            <div
                                key={opt.id}
                                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                                    isSelected
                                        ? colors.selected + ' border-indigo-200'
                                        : 'border-border bg-card text-muted-foreground'
                                }`}
                            >
                                {isSelected ? (
                                    <CheckCircle2
                                        className={`h-4 w-4 shrink-0 ${colors.accent}`}
                                    />
                                ) : (
                                    <Circle className="h-4 w-4 shrink-0 text-muted/50" />
                                )}{' '}
                                <span className="mr-0.5 font-bold">
                                    {opt.id}.
                                </span>
                                {opt.image_url ? (
                                    <img
                                        src={opt.image_url}
                                        alt={`Option ${opt.id}`}
                                        className="h-10 w-auto object-contain"
                                    />
                                ) : (
                                    <span>{opt.text ?? opt.id}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Plain answer (no options) */}
            {options.length === 0 &&
                !content.sub_questions?.length &&
                selectedIds.length > 0 && (
                    <div className="px-5 py-4">
                        <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${colors.badge}`}
                        >
                            {selectedIds.join(', ')}
                        </span>
                    </div>
                )}

            {/* No answer */}
            {selectedIds.length === 0 && !content.sub_questions?.length && (
                <div className="px-5 py-3">
                    <span className="text-xs text-muted-foreground italic">
                        Tidak dijawab
                    </span>
                </div>
            )}
        </div>
    );
}

// ─── Skill Answer Card ─────────────────────────────────────────────────────────

function SkillAnswerCard({
    qId,
    answer,
    index,
}: {
    qId: string;
    answer: SkillAnswer;
    index: number;
}) {
    const ext =
        (answer.original_name ?? '').split('.').pop()?.toLowerCase() ?? '';
    const icon = ['pdf'].includes(ext)
        ? '📄'
        : ['doc', 'docx'].includes(ext)
          ? '📝'
          : ['xls', 'xlsx'].includes(ext)
            ? '📊'
            : '📁';

    return (
        <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-2xl">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-teal-600">
                        #{index}
                    </span>
                    <p className="truncate text-sm font-semibold text-foreground">
                        {answer.original_name ?? 'candidate_submission.file'}
                    </p>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    Diunggah: {answer.uploaded_at ?? '-'} · ID Soal: {qId}
                </p>
            </div>
            <Button variant="outline" size="sm" asChild className="shrink-0">
                <a
                    href={answer.full_url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Unduh
                </a>
            </Button>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PsychotestReport({
    link,
    questions,
    disc_analysis,
    papi_analysis,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Psychotest Management', href: '/psychotest-link' },
        {
            title: `Report: ${link.applicant_name}`,
            href: `/psychotest-link/${link.uuid}/report`,
        },
    ];

    const results = link.results ?? {};

    // Determine which session tabs to show (based on questions that exist + included_tests)
    const availableSessionNums = Object.keys(questions)
        .map(Number)
        .sort((a, b) => a - b);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Report - ${link.applicant_name}`} />
            <div className="flex-1 p-4 md:p-6">
                <div className="mx-auto max-w-5xl space-y-6">
                    {/* ── Header ── */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Psychotest Report
                        </h2>
                        <div className="flex gap-2 print:hidden">
                            <Button
                                variant="outline"
                                onClick={() => window.print()}
                            >
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </Button>
                            <Button asChild>
                                <a href={`/psychotest-link/${link.uuid}/pdf`}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </a>
                            </Button>
                        </div>
                    </div>

                    {/* ── Applicant Info ── */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Applicant Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {[
                                    {
                                        label: 'Full Name',
                                        value: link.applicant_name,
                                    },
                                    {
                                        label: 'Email',
                                        value: link.applicant_email ?? '-',
                                    },
                                    { label: 'NIK', value: link.nik ?? '-' },
                                    {
                                        label: 'Test Duration',
                                        value: link.duration ?? '-',
                                    },
                                    {
                                        label: 'Started At',
                                        value: link.started_at
                                            ? new Date(
                                                  link.started_at,
                                              ).toLocaleString()
                                            : '-',
                                    },
                                    {
                                        label: 'Completed At',
                                        value: link.finished_at
                                            ? new Date(
                                                  link.finished_at,
                                              ).toLocaleString()
                                            : '-',
                                    },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            {label}
                                        </label>
                                        <p className="text-base font-semibold">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Test Results with Tabs ── */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Results</CardTitle>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6">
                            {availableSessionNums.length === 0 ? (
                                <p className="py-8 text-center text-muted-foreground">
                                    No answers recorded.
                                </p>
                            ) : (
                                <Tabs
                                    defaultValue={String(
                                        availableSessionNums[0],
                                    )}
                                >
                                    <TabsList className="mb-6 flex h-auto flex-wrap gap-1">
                                        {availableSessionNums.map((sNum) => {
                                            const sessionResults =
                                                results[`session_${sNum}`];
                                            const isDone =
                                                !!sessionResults?.completed_at;
                                            return (
                                                <TabsTrigger
                                                    key={sNum}
                                                    value={String(sNum)}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    {SESSION_NAMES[sNum] ??
                                                        `Session ${sNum}`}
                                                    {isDone ? (
                                                        <span
                                                            className="inline-block h-1.5 w-1.5 rounded-full bg-green-500"
                                                            title="Selesai"
                                                        />
                                                    ) : (
                                                        <span
                                                            className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-400"
                                                            title="Belum selesai"
                                                        />
                                                    )}
                                                </TabsTrigger>
                                            );
                                        })}
                                    </TabsList>

                                    {availableSessionNums.map((sNum) => {
                                        const sessionQuestions =
                                            questions[String(sNum)] ?? [];
                                        const sessionResultData =
                                            results[`session_${sNum}`] ?? {};
                                        const sessionAnswers =
                                            sessionResultData.answers ?? {};
                                        const isSkill = sNum === 4;

                                        return (
                                            <TabsContent
                                                key={sNum}
                                                value={String(sNum)}
                                                className="mt-0 space-y-4"
                                            >
                                                {/* Session meta */}
                                                <div className="mb-2 flex items-center gap-3">
                                                    <div
                                                        className={`h-8 w-1 rounded-full ${
                                                            sNum === 1
                                                                ? 'bg-violet-500'
                                                                : sNum === 2
                                                                  ? 'bg-sky-500'
                                                                  : sNum === 3
                                                                    ? 'bg-emerald-500'
                                                                    : 'bg-teal-500'
                                                        }`}
                                                    />
                                                    <h3 className="text-lg font-bold tracking-tight uppercase">
                                                        {SESSION_NAMES[sNum] ??
                                                            `Session ${sNum}`}
                                                    </h3>
                                                    <span
                                                        className={`rounded-full px-3 py-0.5 text-xs font-semibold ${SESSION_COLORS[sNum]?.badge ?? ''}`}
                                                    >
                                                        {isSkill
                                                            ? `${Object.keys(sessionAnswers).length} file`
                                                            : `${sessionQuestions.length} soal`}
                                                    </span>
                                                    {sessionResultData.completed_at ? (
                                                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                                                            ✓ Selesai
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                                                            Belum selesai
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Skill test: show files */}
                                                {isSkill && (
                                                    <div className="space-y-3">
                                                        {Object.keys(
                                                            sessionAnswers,
                                                        ).length === 0 ? (
                                                            <p className="py-6 text-center text-sm text-muted-foreground">
                                                                Tidak ada file
                                                                yang diunggah.
                                                            </p>
                                                        ) : (
                                                            Object.entries(
                                                                sessionAnswers,
                                                            ).map(
                                                                (
                                                                    [
                                                                        qId,
                                                                        answer,
                                                                    ]: [
                                                                        string,
                                                                        any,
                                                                    ],
                                                                    idx,
                                                                ) => (
                                                                    <SkillAnswerCard
                                                                        key={
                                                                            qId
                                                                        }
                                                                        qId={
                                                                            qId
                                                                        }
                                                                        answer={
                                                                            answer
                                                                        }
                                                                        index={
                                                                            idx +
                                                                            1
                                                                        }
                                                                    />
                                                                ),
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                                {/* Psycho tests: show questions */}
                                                {!isSkill && (
                                                    <div className="space-y-3">
                                                        {sessionQuestions.length ===
                                                        0 ? (
                                                            <p className="py-6 text-center text-sm text-muted-foreground">
                                                                Tidak ada soal
                                                                ditemukan.
                                                            </p>
                                                        ) : (
                                                            sessionQuestions.map(
                                                                (q, idx) => (
                                                                    <QuestionCard
                                                                        key={
                                                                            q.id
                                                                        }
                                                                        question={
                                                                            q
                                                                        }
                                                                        answer={
                                                                            sessionAnswers[
                                                                                String(
                                                                                    q.id,
                                                                                )
                                                                            ] ??
                                                                            sessionAnswers[
                                                                                q
                                                                                    .id
                                                                            ]
                                                                        }
                                                                        index={
                                                                            idx +
                                                                            1
                                                                        }
                                                                        sessionNum={
                                                                            sNum
                                                                        }
                                                                    />
                                                                ),
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                                {/* DISC Analysis — show scoring below Q&A */}
                                                {sNum === 3 &&
                                                    disc_analysis && (
                                                        <div className="mt-6">
                                                            <p className="mb-3 text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                                                Hasil Penilaian
                                                                DISC
                                                            </p>
                                                            <DiscResultDisplay
                                                                analysis={
                                                                    disc_analysis
                                                                }
                                                            />
                                                        </div>
                                                    )}

                                                {/* PAPI-Costic Analysis — show scoring below Q&A */}
                                                {sNum === 1 &&
                                                    papi_analysis && (
                                                        <div className="mt-6">
                                                            <p className="mb-3 text-sm font-bold tracking-widest text-muted-foreground uppercase">
                                                                Hasil Penilaian
                                                                PAPI-Kostic
                                                            </p>
                                                            <PapiCosticResultDisplay
                                                                analysis={
                                                                    papi_analysis
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                            </TabsContent>
                                        );
                                    })}
                                </Tabs>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
