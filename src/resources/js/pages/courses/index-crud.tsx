import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Course } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course Posts',
        href: '#',
    },
];

interface CoursesIndexProps {
    courses: {
        data: Course[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function CoursesIndex({ courses, filters }: CoursesIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

    const handleSearch = (term: string) => {
        setSearchQuery(term);
        router.get(
            '/courses-index',
            { search: term },
            { preserveState: true, replace: true },
        );
    };

    const handleDeleteClick = (course: Course) => {
        setCourseToDelete(course);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (courseToDelete) {
            router.delete(`/courses/${courseToDelete.id}`, {
                onSuccess: () => {
                    toast.success('Course deleted successfully');
                    setIsDeleteDialogOpen(false);
                    setCourseToDelete(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Course Posts" />
            <div className="flex-1 space-y-6 p-4 md:p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Course Posts
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your blog posts and articles
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Sort by:
                        </span>
                        <Select defaultValue="newest">
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Sort" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button asChild>
                            <Link href="/courses/create">
                                <Plus className="mr-2 h-4 w-4" /> New post
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.data.map((course) => (
                        <Card key={course.id} className="flex flex-col">
                            <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
                                <div className="space-y-1">
                                    <CardTitle className="line-clamp-1 text-base font-semibold">
                                        {course.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {course.created_at
                                            ? dayjs(course.created_at).format(
                                                  'MMM DD, YYYY',
                                              )
                                            : '-'}
                                    </CardDescription>
                                </div>
                                <Badge
                                    variant={
                                        course.is_published
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {course.is_published
                                        ? 'Published'
                                        : 'Draft'}
                                </Badge>
                                {/* Optional: Add image thumbnail here if exists */}
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="line-clamp-3 text-sm text-muted-foreground">
                                    {course.description ||
                                        'No description available.'}
                                </p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-end border-t p-4">
                                <div className="flex items-center gap-1">
                                    <Button variant="outline" size="sm">
                                        <Link
                                            href={`/courses/${course.id}/edit`}
                                            className="flex items-center gap-2"
                                        >
                                            <Pencil />
                                            Edit post
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="flex items-center gap-2"
                                        onClick={() =>
                                            handleDeleteClick(course)
                                        }
                                    >
                                        <Trash2 />
                                        Delete
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {courses.data.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">No posts found.</p>
                    </div>
                )}

                {/* Pagination */}
                {courses.links && courses.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {courses.links.map((link: any, index: number) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                    if (link.url) {
                                        router.visit(link.url, {
                                            preserveState: true,
                                            preserveScroll: true,
                                        });
                                    }
                                }}
                                disabled={!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the course{' '}
                            <strong>{courseToDelete?.title}</strong> and remove
                            its data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
