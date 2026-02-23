import CourseForm from '@/components/course-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Course, Lesson, Tag } from '@/types';
import { Head } from '@inertiajs/react';
import LessonManager from './components/LessonManager';

interface EditCourseProps {
    course: Course;
    tags: Tag[];
    lessons: Lesson[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course Posts',
        href: '/courses-index',
    },
    {
        title: 'Edit Course',
        href: '/courses/edit',
    },
];

export default function EditCourse({ course, tags, lessons }: EditCourseProps) {
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Edit Course" />
                <div className="flex-1 space-y-6 p-4 md:p-6">
                    <div className="mb-8 space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Edit Course: {course.title}
                        </h1>
                        <p className="text-muted-foreground">
                            Update the information for this learning series.
                        </p>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <CourseForm
                            course={course}
                            tags={tags}
                            submitLabel="Update Course"
                            action={`/courses/${course.slug}`}
                            method="put"
                        />
                    </div>

                    <LessonManager course={course} lessons={lessons} />
                </div>
            </AppLayout>
        </>
    );
}
