import AppNavbar from '@/components/app-navbar';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { formatDuration } from '@/lib/utils';
import type { Course, Lesson } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Clock, PlayCircle } from 'lucide-react';

interface CourseDetailProps {
    course: Course;
    lessons: (Lesson & { completed_at: string | null })[];
    isWatchLater: boolean;
}

export default function CourseDetail({
    course,
    lessons: incomingLessons,
    isWatchLater,
}: CourseDetailProps) {
    const lessons = incomingLessons || course.lessons || [];

    const handleStartLearning = () => {
        if (lessons.length > 0) {
            router.visit(`/courses/${course.slug}/lessons/${lessons[0].slug}`);
        }
    };

    const handleToggleWatchLater = () => {
        router.post(
            `/courses/${course.id}/watch-later`,
            {},
            {
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="min-h-screen bg-background text-foreground lg:bg-linear-to-b dark:lg:from-[#202020] dark:lg:to-[#0a0a0a]">
            <Head title={course.title} />
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>

            <div className="py-6 lg:py-20">
                <div className="mx-auto max-w-3xl px-4 text-center">
                    <div className="mb-6 flex justify-center gap-2">
                        {course.tags?.map((tag) => (
                            <Badge
                                key={tag.id}
                                className="text-12 font-bold tracking-wider"
                                style={{
                                    color: tag.color || '#ffffff',
                                    backgroundColor: tag.color
                                        ? `color-mix(in srgb, ${tag.color}, transparent 80%)`
                                        : 'rgba(255,255,255,0.1)',
                                }}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="mb-6 text-4xl leading-tight font-bold lg:text-5xl">
                        {course.title}
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-fg">
                        {course.description}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {lessons.length > 0 && (
                            <Button
                                className="rounded-xl px-8 py-6 font-bold"
                                onClick={handleStartLearning}
                            >
                                <PlayCircle className="mr-2 h-5 w-5" />
                                Mulai Belajar
                            </Button>
                        )}
                        <Button
                            variant={isWatchLater ? 'secondary' : 'outline'}
                            className="rounded-xl border-border px-8 py-6 font-bold hover:bg-accent"
                            onClick={handleToggleWatchLater}
                        >
                            <Clock className="mr-2 h-5 w-5" />
                            {isWatchLater
                                ? 'Batal Tonton Nanti'
                                : 'Tonton Nanti'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 pb-24">
                <div className="border-t border-border px-4 pt-16 lg:px-0">
                    <h2 className="mb-10 text-center text-xl font-bold text-foreground/80">
                        {lessons.length} episode siap untuk dipelajari.
                    </h2>

                    {lessons.length > 0 ? (
                        <div className="space-y-4">
                            {lessons.map((lesson: any, index: number) => (
                                <button
                                    key={lesson.id}
                                    onClick={() =>
                                        router.visit(
                                            `/courses/${course.slug}/lessons/${lesson.slug}`,
                                        )
                                    }
                                    className="group flex w-full cursor-pointer items-center justify-between border-b border-dashed border-border/50 py-5 text-left transition-all"
                                >
                                    <div className="flex items-center gap-2 lg:gap-6">
                                        <span className="text-sm font-medium text-muted-fg/40">
                                            {index + 1}.
                                        </span>
                                        <h3
                                            className={`text-base font-medium transition-colors ${
                                                lesson.completed_at
                                                    ? 'text-emerald-500'
                                                    : 'text-foreground/80 group-hover:text-primary'
                                            }`}
                                        >
                                            {lesson.title}
                                            {lesson.completed_at && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-3 bg-emerald-500/10 text-[10px] font-bold text-emerald-500"
                                                >
                                                    Selesai
                                                </Badge>
                                            )}
                                        </h3>
                                    </div>
                                    <span
                                        className={`text-sm ${
                                            lesson.completed_at
                                                ? 'text-emerald-500/60'
                                                : 'text-muted-fg/40'
                                        }`}
                                    >
                                        {formatDuration(
                                            lesson.duration,
                                            lesson.content_type,
                                        )}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-muted-fg/40">
                            Belum ada lesson untuk course ini.
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
