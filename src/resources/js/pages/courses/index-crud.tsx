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
import { Head, Link, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course Posts',
        href: '#',
    },
];

interface Position {
    id: number;
    name: string;
}

interface CoursesIndexProps {
    courses: {
        data: Course[];
        links: any[];
        current_page: number;
        last_page: number;
    };
    positions: Position[];
    filters: {
        search?: string;
        status?: string;
        position_id?: string;
    };
}

export default function CoursesIndex({
    courses,
    positions,
    filters,
}: CoursesIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

    const updateFilters = (newFilters: any) => {
        router.get(
            '/courses-index',
            {
                search: searchQuery,
                status: filters.status,
                position_id: filters.position_id,
                ...newFilters,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleSearch = (term: string) => {
        setSearchQuery(term);
        updateFilters({ search: term });
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

    const [items, setItems] = useState<Course[]>(courses.data);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(courses.current_page);
    const [lastPage, setLastPage] = useState(courses.last_page);
    const [currentLinks, setCurrentLinks] = useState(courses.links);

    const { version, component } = usePage();

    // Reset items when courses prop changes (e.g. initial load or search/filter)
    useEffect(() => {
        if (courses.current_page === 1) {
            setItems(courses.data);
            setCurrentPage(courses.current_page);
            setLastPage(courses.last_page);
            setCurrentLinks(courses.links);
        }
    }, [courses.data, courses.current_page, courses.last_page, courses.links]);

    // Handle intersection for infinite scroll
    const [observerTarget, setObserverTarget] = useState<HTMLDivElement | null>(
        null,
    );

    useEffect(() => {
        if (!observerTarget || isLoadingMore || currentPage >= lastPage) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                if (entries[0].isIntersecting) {
                    const nextLink = currentLinks.find(
                        (l: any) =>
                            l.label.includes('Next') ||
                            l.label.toLowerCase().includes('next'),
                    );

                    if (nextLink?.url) {
                        setIsLoadingMore(true);

                        try {
                            const response = await fetch(nextLink.url, {
                                headers: {
                                    'X-Inertia': 'true',
                                    'X-Inertia-Version': version || '',
                                    'X-Inertia-Partial-Component': component,
                                    'X-Inertia-Partial-Data': 'courses',
                                    'X-Requested-With': 'XMLHttpRequest',
                                },
                            });

                            if (response.ok) {
                                const data = await response.json();
                                const newCourses = data.props.courses;

                                setItems((prev) => [
                                    ...prev,
                                    ...newCourses.data,
                                ]);
                                setCurrentPage(newCourses.current_page);
                                setLastPage(newCourses.last_page);
                                setCurrentLinks(newCourses.links);
                            }
                        } catch (error) {
                            console.error(
                                'Failed to load more courses:',
                                error,
                            );
                        } finally {
                            setIsLoadingMore(false);
                        }
                    }
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(observerTarget);
        return () => observer.disconnect();
    }, [observerTarget, isLoadingMore, currentPage, lastPage, currentLinks]);

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

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by title, description, or position..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                value={filters.position_id || 'all'}
                                onValueChange={(val) =>
                                    updateFilters({
                                        position_id:
                                            val === 'all' ? undefined : val,
                                    })
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Positions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Positions
                                    </SelectItem>
                                    {positions.map((p) => (
                                        <SelectItem
                                            key={p.id}
                                            value={p.id.toString()}
                                        >
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(val) =>
                                    updateFilters({
                                        status: val === 'all' ? undefined : val,
                                    })
                                }
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="published">
                                        Published
                                    </SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
                    {items.map((course) => (
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

                {items.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">No posts found.</p>
                    </div>
                )}

                {/* Infinite Scroll Trigger */}
                <div
                    ref={setObserverTarget}
                    className="flex justify-center py-8"
                >
                    {isLoadingMore ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    ) : courses.current_page < courses.last_page ? (
                        <div className="h-4 w-1" />
                    ) : items.length > 0 ? (
                        <p className="text-sm text-muted-foreground opacity-50">
                            No more posts to show.
                        </p>
                    ) : null}
                </div>
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
