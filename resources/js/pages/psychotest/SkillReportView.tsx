import { Head } from '@inertiajs/react';
import { Download, PackageOpen, Printer } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillAnswer {
    file_path: string;
    original_name: string;
    uploaded_at: string;
    full_url: string;
}

interface PsychotestLink {
    uuid: string;
    applicant_name: string;
    applicant_email: string | null;
    nik: string | null;
    finished_at: string | null;
    started_at: string | null;
    duration: string | null;
}

interface Props {
    link: PsychotestLink;
    skillAnswers: Record<string, SkillAnswer>;
}

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

function getFileIcon(filename: string) {
    const ext = filename.split('.').pop()?.toLowerCase() ?? '';
    if (['pdf'].includes(ext)) return '📄';
    if (['doc', 'docx'].includes(ext)) return '📝';
    if (['xls', 'xlsx'].includes(ext)) return '📊';
    if (['ppt', 'pptx'].includes(ext)) return '📋';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return '🖼️';
    if (['zip', 'rar', '7z'].includes(ext)) return '🗜️';
    return '📁';
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SkillReportView({ link, skillAnswers }: Props) {
    const answerEntries = Object.entries(skillAnswers);

    return (
        <>
            <Head title={`Skill Test Report — ${link.applicant_name}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 print:bg-white">
                {/* ── Top bar ── */}
                <div className="sticky top-0 z-10 border-b border-teal-100 bg-white/80 backdrop-blur print:hidden">
                    <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600">
                                <span className="text-xs font-bold text-white">
                                    S
                                </span>
                            </div>
                            <div>
                                <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                    Skill Test Report
                                </p>
                                <p className="text-sm leading-none font-bold text-gray-900">
                                    {link.applicant_name}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-sm font-medium text-teal-700 shadow-sm transition-colors hover:bg-teal-50"
                        >
                            <Printer className="h-4 w-4" />
                            Cetak / PDF
                        </button>
                    </div>
                </div>

                <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
                    {/* ── Applicant card ── */}
                    <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
                        <h1 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900">
                            Laporan Hasil Skill Test
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

                    {/* ── Files section ── */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-1.5 rounded-full bg-teal-500" />
                            <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
                                File yang Diunggah
                            </h2>
                            <span className="rounded-full bg-teal-100 px-3 py-0.5 text-xs font-semibold text-teal-700">
                                {answerEntries.length} file
                            </span>
                        </div>

                        {answerEntries.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                                <PackageOpen className="mx-auto h-10 w-10 text-gray-300" />
                                <p className="mt-3 text-sm font-medium text-gray-400">
                                    Belum ada file yang diunggah.
                                </p>
                                <p className="text-xs text-gray-300">
                                    Peserta mungkin belum menyelesaikan skill
                                    test.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {answerEntries.map(([qId, answer], index) => (
                                    <div
                                        key={qId}
                                        className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        {/* File icon */}
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-2xl">
                                            {getFileIcon(answer.original_name)}
                                        </div>

                                        {/* File info */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="shrink-0 text-xs font-semibold text-teal-600">
                                                    #{index + 1}
                                                </span>
                                                <p className="truncate text-sm font-semibold text-gray-800">
                                                    {answer.original_name}
                                                </p>
                                            </div>
                                            <p className="mt-0.5 text-xs text-gray-400">
                                                Diunggah:{' '}
                                                {formatDate(answer.uploaded_at)}{' '}
                                                &nbsp;·&nbsp; ID Soal: {qId}
                                            </p>
                                        </div>

                                        {/* Download button */}
                                        <a
                                            href={answer.full_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex shrink-0 items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100 print:hidden"
                                        >
                                            <Download className="h-4 w-4" />
                                            Unduh
                                        </a>

                                        {/* Print fallback */}
                                        <span className="hidden text-xs text-gray-400 print:inline-block">
                                            {answer.full_url}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Footer */}
                    <p className="pb-6 text-center text-xs text-gray-400">
                        Laporan dibuat secara otomatis • UUID: {link.uuid}
                    </p>
                </div>
            </div>
        </>
    );
}
