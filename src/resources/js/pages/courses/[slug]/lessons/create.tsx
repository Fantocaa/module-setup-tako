import LessonForm from '@/components/lesson-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Course } from '@/types';
import { Head } from '@inertiajs/react';

interface CreateLessonProps {
    course: Course;
}

export default function CreateLesson({ course }: CreateLessonProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Course Posts', href: '/courses-index' },
        {
            title: course.title,
            href: `/courses/${course.slug}/edit`,
        },
        { title: 'Add Lesson', href: `/courses/${course.slug}/lessons/create` },
    ];
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Add Lesson" />

                <div className="flex-1 space-y-6 p-4 md:p-8">
                    <div className="mb-8 space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Add Lesson to {course.title}
                        </h1>
                        <p className="text-muted-foreground">
                            Create a new video or article lesson for this
                            course.
                        </p>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <LessonForm
                            course={course}
                            submitLabel="Create Lesson"
                            action={`/courses/${course.slug}/lessons`}
                        />
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
