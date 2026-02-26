import AppNavbar from '@/components/app-navbar';
import { Footer } from '@/components/footer';
import { Container } from '@/components/ui/container';
import { formatDuration } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface HistoryItem {
    id: number;
    lesson_id: number;
    lesson_title: string;
    lesson_slug: string;
    course_title: string;
    course_slug: string;
    completed_at: string | null;
    last_position: number;
    updated_at: string;
    duration: number;
}

interface HistoryIndexProps {
    history: HistoryItem[];
}

export default function HistoryIndex({ history }: HistoryIndexProps) {
    return (
        <div className="min-h-screen bg-background text-foreground lg:bg-linear-to-b dark:lg:from-[#202020] dark:lg:to-[#0a0a0a]">
            <Head title="Learning History" />
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>

            <div className="border-b border-border/50 px-4 py-8 lg:px-0 lg:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-fg">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Learning History
                            </h1>
                            <p className="mt-1 text-base text-muted-fg">
                                Lanjutkan pembelajaran Anda di mana Anda
                                terakhir kali berhenti.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
                {history.length > 0 ? (
                    <div className="grid gap-4">
                        {history.map((item) => (
                            <Link
                                key={item.id}
                                href={`/courses/${item.course_slug}/lessons/${item.lesson_slug}`}
                                className="group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-border bg-secondary/20 p-6 transition-all hover:border-primary/50 hover:bg-secondary/40 sm:flex-row sm:items-center"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-muted-fg uppercase">
                                        <span>{item.course_title}</span>
                                    </div>
                                    <h3 className="mt-2 text-lg font-bold group-hover:text-primary sm:text-xl">
                                        {item.lesson_title}
                                    </h3>
                                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-fg">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {formatDuration(item.duration)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {item.completed_at ? (
                                                <div className="flex items-center gap-1.5 text-emerald-500">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span className="font-bold">
                                                        Completed
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-amber-500">
                                                    <PlayCircle className="h-4 w-4" />
                                                    <span className="font-bold">
                                                        In Progress
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <span className="opacity-20">•</span>
                                        <span>
                                            Last viewed{' '}
                                            {new Date(
                                                item.updated_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-start sm:justify-end">
                                    <button className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-fg transition-all group-hover:scale-105 active:scale-95">
                                        {item.completed_at
                                            ? 'Review'
                                            : 'Resume'}
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary text-muted-fg/20">
                            <PlayCircle className="h-10 w-10" />
                        </div>
                        <h2 className="mt-6 text-xl font-bold">
                            Belum ada riwayat belajar
                        </h2>
                        <p className="mt-2 max-w-xs text-muted-fg">
                            Mulai belajar sekarang untuk melihat riwayat
                            aktivitas Anda di sini.
                        </p>
                        <Link
                            href="/courses"
                            className="mt-8 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-fg transition-all hover:scale-105 active:scale-95"
                        >
                            Jelajahi Course
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
