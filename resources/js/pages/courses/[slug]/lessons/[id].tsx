import AppNavbar from '@/components/app-navbar';
import PdfViewer from '@/components/pdf-viewer';
import { Container } from '@/components/ui/container';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn, formatDuration } from '@/lib/utils';
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
    Clock,
    ListVideo,
    PanelLeftClose,
    PanelLeftOpen,
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

export default function LessonShow({
    course,
    lesson,
    lessons,
    prevLesson,
    nextLesson,
    currentLessonProgress,
}: LessonShowProps) {
    const { auth } = usePage().props as any;
    // const isOwner = auth?.user?.id === course.instructor?.id;
    const player = useRef<MediaPlayerInstance>(null);
    const lastSavedTime = useRef(0);
    const [hasResumed, setHasResumed] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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
                `/lessons/${lesson.slug}/progress`,
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
            fetch(`/lessons/${lesson.slug}/progress`, {
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
        <div className="min-h-screen bg-background text-foreground lg:bg-linear-to-b dark:lg:from-[#202020] dark:lg:to-[#0a0a0a]">
            <Head title={course.title + ': ' + lesson.title} />
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>
            <Container>
                <div className="mx-auto px-4 pt-0 pb-8 lg:py-8">
                    {/* Header Row: Breadcrumbs & Actions */}
                    <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 overflow-hidden text-sm font-medium whitespace-nowrap text-muted-fg/60">
                            <Link
                                href="/courses"
                                className="shrink-0 hover:text-foreground"
                            >
                                Series
                            </Link>
                            <ChevronRight className="h-4 w-4 shrink-0" />
                            <Link
                                href={`/courses/${course.slug}`}
                                className="truncate hover:text-foreground"
                            >
                                {course.title}
                            </Link>
                            <ChevronRight className="h-4 w-4 shrink-0" />
                            <span className="shrink-0 truncate text-foreground/60">
                                {lesson.title}
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                            {/* Mobile Playlist Trigger */}
                            <div className="lg:hidden">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <button className="flex h-10 items-center gap-2 rounded-xl border border-border bg-secondary px-4 text-sm font-bold text-foreground transition-all hover:bg-secondary/80 active:scale-95">
                                            <ListVideo className="h-4 w-4" />
                                            Playlist
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="right"
                                        className="w-full border-border bg-background p-0 text-foreground sm:max-w-md"
                                    >
                                        <SheetHeader className="border-b border-border p-6 text-left">
                                            <SheetTitle className="text-foreground">
                                                {course.title}
                                            </SheetTitle>
                                            <p className="text-sm font-medium text-muted-fg">
                                                {lessons.length} videos
                                            </p>
                                        </SheetHeader>
                                        <div className="overflow-y-auto p-2">
                                            {lessons.map((l, index) => (
                                                <button
                                                    key={l.id}
                                                    onClick={() =>
                                                        router.visit(
                                                            `/courses/${course.slug}/lessons/${l.slug}`,
                                                        )
                                                    }
                                                    className={`group flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${
                                                        l.id === lesson.id
                                                            ? 'bg-primary/5 text-primary'
                                                            : 'text-muted-fg hover:bg-secondary hover:text-foreground'
                                                    }`}
                                                >
                                                    <div
                                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                                                            l.id === lesson.id
                                                                ? 'bg-primary text-primary-fg'
                                                                : l.completed_at
                                                                  ? 'bg-emerald-500/10 text-emerald-500'
                                                                  : 'bg-secondary text-muted-fg group-hover:bg-secondary/80 group-hover:text-foreground'
                                                        }`}
                                                    >
                                                        {l.completed_at ? (
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3
                                                            className={`truncate text-sm leading-tight font-semibold transition-colors ${
                                                                l.id ===
                                                                lesson.id
                                                                    ? 'text-primary'
                                                                    : l.completed_at
                                                                      ? 'text-emerald-500'
                                                                      : 'text-muted-fg group-hover:text-foreground'
                                                            }`}
                                                        >
                                                            {l.title}
                                                        </h3>
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
                                                                <span
                                                                    className={
                                                                        l.completed_at &&
                                                                        l.id !==
                                                                            lesson.id
                                                                            ? 'text-emerald-500/60'
                                                                            : 'text-muted-fg/60'
                                                                    }
                                                                >
                                                                    {formatDuration(
                                                                        l.duration,
                                                                        l.content_type as any,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {l.id === lesson.id && (
                                                        <PlayCircle className="h-5 w-5 fill-current opacity-20" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        setIsSidebarExpanded(!isSidebarExpanded)
                                    }
                                    className="hidden h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary text-muted-fg transition-all hover:bg-secondary/80 hover:text-foreground lg:flex"
                                    title={
                                        isSidebarExpanded
                                            ? 'Collapse Sidebar'
                                            : 'Expand Sidebar'
                                    }
                                >
                                    {isSidebarExpanded ? (
                                        <PanelLeftClose className="h-5 w-5" />
                                    ) : (
                                        <PanelLeftOpen className="h-5 w-5" />
                                    )}
                                </button>
                                {prevLesson ? (
                                    <Link
                                        href={`/courses/${course.slug}/lessons/${prevLesson!.slug}`}
                                        className="flex h-10 items-center gap-2 rounded-xl border border-border bg-secondary px-3 text-sm font-bold text-foreground transition-all hover:bg-secondary/80 active:scale-95"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                        <span className="hidden sm:inline">
                                            Prev
                                        </span>
                                    </Link>
                                ) : (
                                    <div className="flex h-10 items-center gap-2 rounded-xl border border-border bg-secondary px-3 text-sm font-bold opacity-30 grayscale select-none">
                                        <ChevronLeft className="h-5 w-5" />
                                        <span className="hidden sm:inline">
                                            Prev
                                        </span>
                                    </div>
                                )}
                                {nextLesson ? (
                                    <Link
                                        href={`/courses/${course.slug}/lessons/${nextLesson!.slug}`}
                                        className="flex h-10 items-center gap-2 rounded-xl border border-border bg-secondary px-3 text-sm font-bold text-foreground transition-all hover:bg-secondary/80 active:scale-95"
                                    >
                                        <span className="hidden sm:inline">
                                            Next
                                        </span>
                                        <ChevronRight className="h-5 w-5" />
                                    </Link>
                                ) : (
                                    <div className="flex h-10 items-center gap-2 rounded-xl border border-border bg-secondary px-3 text-sm font-bold opacity-30 grayscale select-none">
                                        <span className="hidden sm:inline">
                                            Next
                                        </span>
                                        <ChevronRight className="h-5 w-5" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 lg:flex-row">
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

                            {lesson.content_type === 'pdf' &&
                                lesson.pdf_path && (
                                    <PdfViewer
                                        file={`/lessons/${lesson.slug}/pdf`}
                                        title={lesson.title}
                                    />
                                )}

                            <div className="mt-8 max-w-3xl lg:mt-0">
                                <div className="mb-10 lg:mb-16">
                                    <h1 className="text-3xl leading-snug font-bold tracking-tight lg:text-4xl xl:text-5xl">
                                        {lesson.title}
                                    </h1>
                                    <p className="mt-4 flex items-center gap-2 text-sm font-medium text-muted-fg">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            {formatDuration(
                                                lesson.duration,
                                                lesson.content_type as any,
                                            )}
                                            {lesson.content_type === 'video'
                                                ? ''
                                                : ' read'}
                                        </span>
                                    </p>
                                </div>

                                <div className="prose prose-lg max-w-none prose-neutral lg:prose-xl dark:prose-invert prose-headings:scroll-mt-28 prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed">
                                    {lesson.content ? (
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                        >
                                            {lesson.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p className="text-muted-fg italic">
                                            Mari kita mulai belajar materi ini.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Lessons List */}
                        <div
                            className={cn(
                                'hidden shrink-0 transition-all duration-300 ease-in-out lg:block',
                                isSidebarExpanded
                                    ? 'w-[350px] opacity-100'
                                    : 'w-0 overflow-hidden opacity-0',
                            )}
                        >
                            <div className="w-[350px] overflow-hidden rounded-2xl border border-border bg-secondary/50">
                                <div className="border-b border-border p-6">
                                    <Link href={`/courses/${course.slug}`}>
                                        <h2 className="mb-2 leading-tight font-bold text-foreground transition-colors hover:text-primary">
                                            {course.title}
                                        </h2>
                                    </Link>
                                    <p className="text-sm font-medium text-muted-fg">
                                        {lessons.length} videos
                                    </p>
                                </div>

                                <div className="p-2">
                                    {lessons.map((l, index) => (
                                        <button
                                            key={l.id}
                                            onClick={() =>
                                                router.visit(
                                                    `/courses/${course.slug}/lessons/${l.slug}`,
                                                )
                                            }
                                            className={`group flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all ${
                                                l.id === lesson.id
                                                    ? 'bg-primary/5 text-primary'
                                                    : 'text-muted-fg hover:bg-secondary hover:text-foreground'
                                            }`}
                                        >
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                                                    l.id === lesson.id
                                                        ? 'bg-primary text-primary-fg'
                                                        : l.completed_at
                                                          ? 'bg-emerald-500/10 text-emerald-500'
                                                          : 'bg-secondary text-muted-fg group-hover:bg-secondary/80 group-hover:text-foreground'
                                                }`}
                                            >
                                                {l.completed_at ? (
                                                    <CheckCircle2 className="h-4 w-4" />
                                                ) : (
                                                    index + 1
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3
                                                    className={`truncate text-sm leading-tight font-semibold transition-colors ${
                                                        l.id === lesson.id
                                                            ? 'text-primary'
                                                            : l.completed_at
                                                              ? 'text-emerald-500'
                                                              : 'text-muted-fg group-hover:text-foreground'
                                                    }`}
                                                >
                                                    {l.title}
                                                </h3>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase">
                                                        <span
                                                            className={
                                                                l.completed_at &&
                                                                l.id !==
                                                                    lesson.id
                                                                    ? 'text-emerald-500/60'
                                                                    : 'text-muted-fg/60'
                                                            }
                                                        >
                                                            {formatDuration(
                                                                l.duration,
                                                                l.content_type as any,
                                                            )}
                                                        </span>
                                                    </div>
                                                    {l.last_position !== null &&
                                                        l.duration &&
                                                        !l.completed_at && (
                                                            <div className="h-1 flex-1 rounded-full bg-border">
                                                                <div
                                                                    className="h-full rounded-full bg-primary"
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
                    </div>
                </div>
            </Container>
        </div>
    );
}
