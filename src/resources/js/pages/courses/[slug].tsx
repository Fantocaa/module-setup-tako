import AppNavbar from '@/components/app-navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import type { Course } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Clock, PlayCircle } from 'lucide-react';

interface CourseShowProps {
    course: Course;
}

function formatDuration(seconds: number | null) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function CourseShow({ course }: CourseShowProps) {
    const { auth } = usePage().props as any;
    const lessons = course.lessons || [];
    // const isOwner = auth?.user?.id === course.instructor?.id;

    // const handleDelete = () => {
    //     if (
    //         confirm(
    //             'Are you sure you want to delete this course? This action cannot be undone.',
    //         )
    //     ) {
    //         router.delete(`/courses/${course.slug}`);
    //     }
    // };

    const handleStartLearning = () => {
        if (lessons.length > 0) {
            router.visit(`/courses/${course.slug}/lessons/${lessons[0].id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#202020] to-black text-white">
            <Head title={course.title} />
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>

            <div className="py-20">
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
                    <h1 className="mb-6 text-5xl leading-tight font-bold text-white">
                        {course.title}
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/60">
                        {course.description}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        {lessons.length > 0 && (
                            <Button
                                className="rounded-lg px-8 py-6"
                                onClick={handleStartLearning}
                            >
                                <PlayCircle className="mr-2 h-5 w-5" />
                                Mulai Belajar
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="rounded-lg border-white/10 px-4 py-6 font-medium hover:bg-white/10"
                        >
                            <Clock className="mr-2 h-5 w-5" />
                            Tonton Nanti
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 pb-24">
                <div className="border-t border-white/5 pt-16">
                    <h2 className="mb-10 text-center text-xl font-bold text-white/90">
                        {lessons.length} episodes siap untuk dipelajari.
                    </h2>

                    {lessons.length > 0 ? (
                        <div className="space-y-4">
                            {lessons.map((lesson: any, index: number) => (
                                <button
                                    key={lesson.id}
                                    onClick={() =>
                                        router.visit(
                                            `/courses/${course.slug}/lessons/${lesson.id}`,
                                        )
                                    }
                                    className="group flex w-full cursor-pointer items-center justify-between border-b border-dashed border-white/[0.25] py-5 text-left transition-all hover:text-white"
                                >
                                    <div className="flex items-center gap-6">
                                        <span className="text-sm font-medium text-white/30">
                                            {index + 1}.
                                        </span>
                                        <h3 className="text-base font-medium text-white/80 group-hover:text-white">
                                            {lesson.title}
                                        </h3>
                                    </div>
                                    <span className="text-sm text-white/30">
                                        {formatDuration(lesson.duration)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-white/40">
                            Belum ada lesson untuk course ini.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
