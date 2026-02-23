import CourseForm from '@/components/course-form';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Tag } from '@/types';
import { Head } from '@inertiajs/react';

interface CreateCourseProps {
    tags: Tag[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Courses', href: '/courses' },
    { title: 'Create', href: '/courses/create' },
];

export default function CreateCourse({ tags }: CreateCourseProps) {
    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Create Course" />
                <div className="flex-1 space-y-6 p-4 md:p-6">
                    <div className="mb-8 space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Create New Course
                        </h1>
                        <p className="text-muted-foreground">
                            Fill in the details below to start a new learning
                            series.
                        </p>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <CourseForm
                            tags={tags}
                            submitLabel="Create Course"
                            action="/courses"
                        />
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
