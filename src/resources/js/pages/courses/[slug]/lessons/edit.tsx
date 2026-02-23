import LessonForm from '@/components/lesson-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Course, Lesson } from '@/types';
import { Head } from '@inertiajs/react';

interface EditLessonProps {
    course: Course;
    lesson: Lesson;
}

export default function EditLesson({ course, lesson }: EditLessonProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Course Posts',
            href: '/courses-index',
        },
        {
            title: course.title,
            href: `/courses/${course.slug}/edit`,
        },
        {
            title: 'Edit Lesson',
            href: `/courses/${course.slug}/lessons/${lesson.id}/edit`,
        },
    ];
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Edit Lesson" />
                <div className="flex-1 space-y-6 p-4 md:p-6">
                    <div className="mb-8 space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Episode: {lesson.title}
                        </h1>
                        <p className="text-muted-foreground">
                            Update the content or details for this lesson in{' '}
                            {course.title}.
                        </p>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <LessonForm
                            course={course}
                            lesson={lesson}
                            submitLabel="Update Lesson"
                            action={`/courses/${course.slug}/lessons/${lesson.id}`}
                            method="put"
                        />
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
