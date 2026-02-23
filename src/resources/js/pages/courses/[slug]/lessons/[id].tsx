import AppNavbar from '@/components/app-navbar';
import { Container } from '@/components/ui/container';
import type { Course, Lesson } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    MediaPlayer,
    MediaProvider,
    type MediaPlayerInstance,
} from '@vidstack/react';
import {
    DefaultVideoLayout,
    defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/layouts/video.css';
import '@vidstack/react/player/styles/default/theme.css';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    PlayCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LessonShowProps {
    course: Course;
    lesson: Lesson;
    lessons: (Lesson & {
        completed_at: string | null;
        last_position: number | null;
    })[];
    prevLesson: Lesson | null;
    nextLesson: Lesson | null;
    currentLessonProgress: {
        last_position: number | null;
        completed_at: string | null;
    } | null;
}

function formatDuration(seconds: number | null) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function LessonShow({
    course,
    lesson,
    lessons,
    prevLesson,
    nextLesson,
    currentLessonProgress,
}: LessonShowProps) {
    const { auth } = usePage().props as any;
    const isOwner = auth?.user?.id === course.instructor?.id;
    const player = useRef<MediaPlayerInstance>(null);
    const lastSavedTime = useRef(0);
    const [hasResumed, setHasResumed] = useState(false);

    // Fullscreen shortcut 'f'
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key.toLowerCase() === 'f' &&
                !['input', 'textarea'].includes(
                    (event.target as HTMLElement).tagName.toLowerCase(),
                )
            ) {
                event.preventDefault();
                if (player.current?.state.fullscreen) {
                    player.current.exitFullscreen();
                } else {
                    player.current?.enterFullscreen();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Resume logic
    useEffect(() => {
        if (
            player.current &&
            currentLessonProgress?.last_position &&
            !hasResumed
        ) {
            player.current.currentTime = currentLessonProgress.last_position;
            setHasResumed(true);
        }
    }, [currentLessonProgress, hasResumed]);

    const saveProgress = (time: number, isCompleted: boolean = false) => {
        // Only save if it's a significant jump (e.g. 5 seconds) or if completed
        if (!isCompleted && Math.abs(time - lastSavedTime.current) < 5) return;

        lastSavedTime.current = time;

        if (isCompleted) {
            router.post(
                `/lessons/${lesson.id}/progress`,
                {
                    last_position: Math.floor(time),
                    is_completed: isCompleted,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        } else {
            // Use fetch for silent periodic updates (no loading bar)
            fetch(`/lessons/${lesson.id}/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({
                    last_position: Math.floor(time),
                    is_completed: isCompleted,
                }),
            }).catch((err) => console.error('Silent save failed:', err));
        }
    };

    const onTimeUpdate = (event: any) => {
        saveProgress(event.currentTime);
    };

    const onEnded = () => {
        saveProgress(player.current?.currentTime || 0, true);
    };

    const videoSrc = lesson.video_path
        ? `/storage/${lesson.video_path}`
        : lesson.video_url || '';

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#202020] to-black text-white">
            <Head title={lesson.title} />
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>
            <Container>
                <div className="mx-auto px-4 py-8">
                    {/* Breadcrumbs */}
                    <div className="mb-8 flex items-center gap-2 text-sm font-medium text-white/40">
                        <Link href="/courses" className="hover:text-white">
                            Series
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <Link
                            href={`/courses/${course.slug}`}
                            className="hover:text-white"
                        >
                            {course.title}
                        </Link>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-white/60">
                            {lessons.findIndex((l) => l.id === lesson.id) + 1}
                        </span>
                    </div>

                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Sidebar - Lessons List */}
                        <div className="w-full shrink-0 lg:w-[350px]">
                            <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#121212]">
                                <div className="border-b border-white/5 p-6">
                                    <Link href={`/courses/${course.slug}`}>
                                        <h2 className="mb-2 text-lg leading-tight font-bold text-white transition-colors hover:text-white/80">
                                            {course.title}
                                        </h2>
                                    </Link>
                                    <p className="text-sm font-medium text-white/30">
                                        {lessons.length} videos
                                    </p>
                                </div>

                                <div className="p-2">
                                    {lessons.map((l, index) => (
                                        <button
                                            key={l.id}
                                            onClick={() =>
                                                router.visit(
                                                    `/courses/${course.slug}/lessons/${l.id}`,
                                                )
                                            }
                                            className={`group flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${
                                                l.id === lesson.id
                                                    ? 'bg-white/5 text-white'
                                                    : 'text-white/40 hover:bg-white/[0.02] hover:text-white/70'
                                            }`}
                                        >
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                                    l.id === lesson.id
                                                        ? 'bg-white text-black'
                                                        : 'bg-white/5 text-white/30 group-hover:bg-white/10 group-hover:text-white/50'
                                                }`}
                                            >
                                                {l.completed_at ? (
                                                    <CheckCircle2 className="h-4 w-4" />
                                                ) : (
                                                    index + 1
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-sm leading-tight font-semibold">
                                                    {l.title}
                                                </h3>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
                                                        <span>
                                                            {formatDuration(
                                                                l.duration,
                                                            )}
                                                        </span>
                                                    </div>
                                                    {l.last_position !== null &&
                                                        l.duration &&
                                                        !l.completed_at && (
                                                            <div className="h-1 flex-1 rounded-full bg-white/5">
                                                                <div
                                                                    className="h-full rounded-full bg-white/40"
                                                                    style={{
                                                                        width: `${Math.min(100, (l.last_position / l.duration) * 100)}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                            {l.id === lesson.id && (
                                                <PlayCircle className="h-5 w-5 fill-current text-white/20" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="min-w-0 flex-1">
                            {/* Video Area */}
                            {lesson.content_type === 'video' && videoSrc && (
                                <div className="overflow-hidden rounded-2xl border border-white/5 bg-black shadow-2xl">
                                    <MediaPlayer
                                        ref={player}
                                        title={lesson.title}
                                        src={videoSrc}
                                        onTimeUpdate={onTimeUpdate}
                                        onEnded={onEnded}
                                        onContextMenu={(e) =>
                                            e.preventDefault()
                                        }
                                        className="aspect-video w-full bg-black text-white"
                                        playsInline
                                    >
                                        <MediaProvider />
                                        <DefaultVideoLayout
                                            icons={defaultLayoutIcons}
                                        />
                                    </MediaPlayer>
                                </div>
                            )}

                            {/* Lesson Info */}
                            <div className="mt-10">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1 space-y-4">
                                        <h1 className="text-3xl font-bold tracking-tight text-white">
                                            {lesson.title}
                                        </h1>

                                        <div className="prose prose-lg max-w-none text-white/80 prose-invert">
                                            {lesson.content ? (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                >
                                                    {lesson.content}
                                                </ReactMarkdown>
                                            ) : (
                                                <p className="text-white/50">
                                                    Mari kita mulai belajar
                                                    materi ini.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        {prevLesson && (
                                            <Link
                                                href={`/courses/${course.slug}/lessons/${prevLesson.id}`}
                                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </Link>
                                        )}
                                        {nextLesson && (
                                            <Link
                                                href={`/courses/${course.slug}/lessons/${nextLesson.id}`}
                                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-white/40 transition-all hover:bg-white/10 hover:text-white"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
