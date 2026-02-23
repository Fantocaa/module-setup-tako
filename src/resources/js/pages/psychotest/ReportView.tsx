import {
    DiscResultDisplay,
    type DiscAnalysis,
} from '@/components/disc-result-display';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Circle, FileImage, Printer } from 'lucide-react';
import { useState } from 'react';

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

interface PsychotestLink {
    uuid: string;
    applicant_name: string;
    applicant_email: string | null;
    nik: string | null;
    finished_at: string | null;
    started_at: string | null;
    duration: string | null;
    results: Record<string, any> | null;
}

interface Props {
    link: PsychotestLink;
    questions: Record<string, Question[]>;
    disc_analysis?: DiscAnalysis | null;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const SESSION_NAMES: Record<number, string> = {
    1: 'PAPICOSTIC',
    2: 'CFIT',
    3: 'DISC',
};

const SESSION_STYLE: Record<
    number,
    {
        accent: string;
        tab: string;
        tabActive: string;
        badge: string;
        dot: string;
        selected: string;
    }
> = {
    1: {
        accent: 'bg-violet-500',
        tab: 'text-gray-500 hover:text-violet-600 hover:border-violet-300',
        tabActive: 'text-violet-700 border-violet-500 font-bold',
        badge: 'bg-violet-100 text-violet-700',
        dot: 'bg-violet-500',
        selected: 'border-violet-400 bg-violet-50 text-violet-700',
    },
    2: {
        accent: 'bg-sky-500',
        tab: 'text-gray-500 hover:text-sky-600 hover:border-sky-300',
        tabActive: 'text-sky-700 border-sky-500 font-bold',
        badge: 'bg-sky-100 text-sky-700',
        dot: 'bg-sky-500',
        selected: 'border-sky-400 bg-sky-50 text-sky-700',
    },
    3: {
        accent: 'bg-emerald-500',
        tab: 'text-gray-500 hover:text-emerald-600 hover:border-emerald-300',
        tabActive: 'text-emerald-700 border-emerald-500 font-bold',
        badge: 'bg-emerald-100 text-emerald-700',
        dot: 'bg-emerald-500',
        selected: 'border-emerald-400 bg-emerald-50 text-emerald-700',
    },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

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
    const style = SESSION_STYLE[sessionNum] ?? SESSION_STYLE[1];

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
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-start gap-3 border-b border-gray-100 bg-gray-50 px-5 py-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                    {index}
                </span>
                <div className="min-w-0 flex-1">
                    {content.text && (
                        <p className="text-sm leading-relaxed font-medium text-gray-800">
                            {content.text}
                        </p>
                    )}
                    {content.image_url && (
                        <img
                            src={content.image_url}
                            alt="Question"
                            className="mt-2 max-h-40 w-auto rounded-lg border border-gray-200 object-contain"
                        />
                    )}
                    {!content.text && !content.image_url && (
                        <p className="text-sm text-gray-400 italic">
                            Question #{question.question_number}
                        </p>
                    )}
                </div>
                <span className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-500 uppercase">
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
                                className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                            >
                                <span className="mt-0.5 text-xs font-semibold text-gray-400">
                                    {sq.id}.
                                </span>
                                <div className="flex-1">
                                    {sq.text && (
                                        <p className="text-sm text-gray-700">
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
                                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${style.badge}`}
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
                                        ? style.selected + ' font-semibold'
                                        : 'border-gray-200 bg-white text-gray-500'
                                }`}
                            >
                                {isSelected ? (
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                ) : (
                                    <Circle className="h-4 w-4 shrink-0 text-gray-300" />
                                )}
                                <span className="mr-0.5 font-bold">
                                    {opt.id}.
                                </span>
                                <span className="flex-1">
                                    {opt.text ?? opt.id}
                                </span>
                                {isDisc && discMost === String(opt.id) && (
                                    <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-black text-white">
                                        MOST
                                    </span>
                                )}
                                {isDisc && discLeast === String(opt.id) && (
                                    <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-black text-white">
                                        LEAST
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Plain answer */}
            {options.length === 0 &&
                !content.sub_questions?.length &&
                selectedIds.length > 0 && (
                    <div className="px-5 py-4">
                        <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${style.badge}`}
                        >
                            {selectedIds.join(', ')}
                        </span>
                    </div>
                )}

            {/* No answer */}
            {selectedIds.length === 0 && !content.sub_questions?.length && (
                <div className="px-5 py-3">
                    <span className="text-xs text-gray-400 italic">
                        Tidak dijawab
                    </span>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ReportView({ link, questions, disc_analysis }: Props) {
    const results = link.results ?? {};

    const sessionNums = Object.keys(questions)
        .map(Number)
        .sort((a, b) => a - b);
    const [activeTab, setActiveTab] = useState<number>(sessionNums[0] ?? 1);

    return (
        <>
            <Head title={`Laporan Psikotes — ${link.applicant_name}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 print:bg-white">
                {/* ── Top bar ── */}
                <div className="sticky top-0 z-10 border-b border-indigo-100 bg-white/80 backdrop-blur print:hidden">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
                                <span className="text-xs font-bold text-white">
                                    P
                                </span>
                            </div>
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                    Laporan Psikotes
                                </p>
                                <p className="text-sm leading-none font-bold text-gray-900">
                                    {link.applicant_name}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50"
                        >
                            <Printer className="h-4 w-4" />
                            Cetak / PDF
                        </button>
                    </div>
                </div>

                <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
                    {/* ── Applicant Info ── */}
                    <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
                        <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900">
                            Laporan Hasil Psikotes
                        </h1>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {[
                                {
                                    label: 'Nama Lengkap',
                                    value: link.applicant_name,
                                },
                                {
                                    label: 'Email',
                                    value: link.applicant_email ?? '-',
                                },
                                { label: 'NIK', value: link.nik ?? '-' },
                                {
                                    label: 'Selesai Pada',
                                    value: formatDate(link.finished_at),
                                },
                                {
                                    label: 'Dimulai Pada',
                                    value: formatDate(link.started_at),
                                },
                                {
                                    label: 'Durasi',
                                    value: link.duration ?? '-',
                                },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                                        {label}
                                    </p>
                                    <p className="mt-0.5 text-sm font-semibold text-gray-800">
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Tabs ── */}
                    {sessionNums.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                            <FileImage className="mx-auto h-10 w-10 text-gray-300" />
                            <p className="mt-3 text-sm text-gray-400">
                                Belum ada soal yang tersedia.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                            {/* Tab list */}
                            <div className="flex overflow-x-auto border-b border-gray-100">
                                {sessionNums.map((sNum) => {
                                    const style =
                                        SESSION_STYLE[sNum] ?? SESSION_STYLE[1];
                                    const isDone =
                                        !!results[`session_${sNum}`]
                                            ?.completed_at;
                                    const isActive = activeTab === sNum;
                                    return (
                                        <button
                                            key={sNum}
                                            onClick={() => setActiveTab(sNum)}
                                            className={`group relative flex shrink-0 items-center gap-2 border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
                                                isActive
                                                    ? style.tabActive +
                                                      ' bg-gray-50/80'
                                                    : 'border-transparent ' +
                                                      style.tab
                                            }`}
                                        >
                                            {/* Colored dot */}
                                            <span
                                                className={`h-2 w-2 rounded-full ${isActive ? style.dot : 'bg-gray-300'}`}
                                            />
                                            {SESSION_NAMES[sNum] ??
                                                `Session ${sNum}`}
                                            {/* Done/not-done indicator */}
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${isDone ? 'bg-green-500' : 'bg-yellow-400'}`}
                                                title={
                                                    isDone
                                                        ? 'Selesai'
                                                        : 'Belum selesai'
                                                }
                                            />
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tab content */}
                            <div className="p-5">
                                {sessionNums.map((sNum) => {
                                    if (sNum !== activeTab) return null;
                                    const style =
                                        SESSION_STYLE[sNum] ?? SESSION_STYLE[1];
                                    const sessionQuestions =
                                        questions[String(sNum)] ?? [];
                                    const sessionResultData =
                                        results[`session_${sNum}`] ?? {};
                                    const sessionAnswers =
                                        sessionResultData.answers ?? {};

                                    return (
                                        <div key={sNum} className="space-y-4">
                                            {/* Session header */}
                                            <div className="mb-4 flex items-center gap-3">
                                                <div
                                                    className={`h-8 w-1.5 rounded-full ${style.accent}`}
                                                />
                                                <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
                                                    {SESSION_NAMES[sNum] ??
                                                        `Session ${sNum}`}
                                                </h2>
                                                <span
                                                    className={`rounded-full px-3 py-0.5 text-xs font-semibold ${style.badge}`}
                                                >
                                                    {sessionQuestions.length}{' '}
                                                    soal
                                                </span>
                                                {sessionResultData.completed_at ? (
                                                    <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-700">
                                                        ✓ Selesai
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-yellow-100 px-3 py-0.5 text-xs font-semibold text-yellow-700">
                                                        Belum selesai
                                                    </span>
                                                )}
                                            </div>

                                            {sessionQuestions.length === 0 ? (
                                                <p className="py-8 text-center text-sm text-gray-400">
                                                    Tidak ada soal ditemukan
                                                    untuk sesi ini.
                                                </p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {sessionQuestions.map(
                                                        (q, idx) => (
                                                            <QuestionCard
                                                                key={q.id}
                                                                question={q}
                                                                answer={
                                                                    sessionAnswers[
                                                                        String(
                                                                            q.id,
                                                                        )
                                                                    ] ??
                                                                    sessionAnswers[
                                                                        q.id
                                                                    ]
                                                                }
                                                                index={idx + 1}
                                                                sessionNum={
                                                                    sNum
                                                                }
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            )}

                                            {/* DISC Analysis */}
                                            {sNum === 3 && disc_analysis && (
                                                <div className="mt-6">
                                                    <p className="mb-3 text-xs font-bold tracking-widest text-gray-400 uppercase">
                                                        Hasil Penilaian DISC
                                                    </p>
                                                    <DiscResultDisplay
                                                        analysis={disc_analysis}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <p className="pb-6 text-center text-xs text-gray-400">
                        Laporan dibuat secara otomatis • UUID: {link.uuid}
                    </p>
                </div>
            </div>
        </>
    );
}
