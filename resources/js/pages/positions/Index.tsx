import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { BookOpen, Briefcase, Edit } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Position Management',
        href: '/positions',
    },
];

interface Course {
    id: number;
    title: string;
}

interface Position {
    id: number;
    name: string;
    description: string | null;
    courses: Course[];
    users_count: number;
}

interface Tag {
    id: number;
    name: string;
    courses: { id: number }[];
}

interface Props {
    positions: Position[];
    courses: Course[];
    tags: Tag[];
}

export default function PositionIndex({ positions, courses, tags }: Props) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState<Position | null>(
        null,
    );

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            description: '',
            courses: [] as number[],
        });

    const handleDelete = (id: number) => {
        router.delete(`/positions/${id}`, {
            onSuccess: () => toast.success('Position deleted successfully'),
            onError: () => toast.error('Failed to delete position'),
        });
    };

    const toggleCourse = (courseId: number) => {
        setData(
            'courses',
            data.courses.includes(courseId)
                ? data.courses.filter((id) => id !== courseId)
                : [...data.courses, courseId],
        );
    };

    const toggleTag = (tag: Tag) => {
        const tagCourseIds = tag.courses.map((c) => c.id);
        const allTagCoursesSelected = tagCourseIds.every((id) =>
            data.courses.includes(id),
        );

        if (allTagCoursesSelected) {
            // Remove all courses belonging to this tag
            setData(
                'courses',
                data.courses.filter((id) => !tagCourseIds.includes(id)),
            );
        } else {
            // Add all courses belonging to this tag (avoid duplicates)
            const newCourses = [...data.courses];
            tagCourseIds.forEach((id) => {
                if (!newCourses.includes(id)) {
                    newCourses.push(id);
                }
            });
            setData('courses', newCourses);
        }
    };

    const toggleAllCourses = () => {
        const allChecked = courses.every((course) =>
            data.courses.includes(course.id),
        );
        setData('courses', allChecked ? [] : courses.map((c) => c.id));
    };

    const isTagSelected = (tag: Tag) => {
        return (
            tag.courses.length > 0 &&
            tag.courses.every((c) => data.courses.includes(c.id))
        );
    };

    const openCreateSheet = () => {
        setEditingPosition(null);
        reset();
        clearErrors();
        setIsSheetOpen(true);
    };

    const openEditSheet = (position: Position) => {
        setEditingPosition(position);
        setData({
            name: position.name,
            description: position.description || '',
            courses: position.courses.map((c) => c.id),
        });
        clearErrors();
        setIsSheetOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingPosition) {
            put(`/positions/${editingPosition.id}`, {
                onSuccess: () => {
                    setIsSheetOpen(false);
                    toast.success('Position updated successfully');
                },
            });
        } else {
            post('/positions', {
                onSuccess: () => {
                    setIsSheetOpen(false);
                    toast.success('Position created successfully');
                    reset();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Position Management" />
            <div className="flex-1 space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Position Management (Jabatan)
                        </h1>
                        <p className="text-muted-foreground">
                            Manage user positions and their assigned courses
                        </p>
                    </div>
                    <Button size="sm" onClick={openCreateSheet}>
                        + Add Position
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {positions.length === 0 && (
                        <Card className="lg:col-span-2">
                            <CardContent className="py-10 text-center text-muted-foreground">
                                <Briefcase className="mx-auto mb-4 h-12 w-12 opacity-20" />
                                <p>
                                    No positions available. Create your first
                                    position to start assigning courses.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {positions.map((position) => (
                        <Card key={position.id} className="border shadow-sm">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                        {position.name}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {position.users_count} user
                                        {position.users_count !== 1
                                            ? 's'
                                            : ''}{' '}
                                        assigned
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEditSheet(position)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-trash-2"
                                                >
                                                    <path d="M3 6h18" />
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                    <line
                                                        x1="10"
                                                        x2="10"
                                                        y1="11"
                                                        y2="17"
                                                    />
                                                    <line
                                                        x1="14"
                                                        x2="14"
                                                        y1="11"
                                                        y2="17"
                                                    />
                                                </svg>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Are you sure?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Position{' '}
                                                    <strong>
                                                        {position.name}
                                                    </strong>{' '}
                                                    will be deleted. Users
                                                    assigned to this position
                                                    will lose their course
                                                    access.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        handleDelete(
                                                            position.id,
                                                        )
                                                    }
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Yes, Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {position.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {position.description}
                                    </p>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                        <BookOpen className="h-4 w-4" />
                                        Course Access ({position.courses.length}
                                        )
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {position.courses.length > 0 ? (
                                            position.courses.map((course) => (
                                                <Badge
                                                    key={course.id}
                                                    variant="secondary"
                                                    className="text-xs font-normal"
                                                >
                                                    {course.title}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-muted-foreground italic">
                                                No courses assigned
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="overflow-y-auto sm:max-w-xl">
                    <SheetHeader className="mb-6">
                        <SheetTitle>
                            {editingPosition
                                ? 'Edit Position'
                                : 'Create Position'}
                        </SheetTitle>
                        <SheetDescription>
                            {editingPosition
                                ? 'Update position name, description, and assigned courses'
                                : 'Create a new position and select courses for its members'}
                        </SheetDescription>
                    </SheetHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 px-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Position Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Accounting, Marketing, IT"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className={
                                        errors.name ? 'border-destructive' : ''
                                    }
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description (Optional)
                                </Label>
                                <Input
                                    id="description"
                                    placeholder="Position description..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Course Access
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Select courses for this position
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="select-all-courses"
                                            checked={
                                                courses.length > 0 &&
                                                courses.every((c) =>
                                                    data.courses.includes(c.id),
                                                )
                                            }
                                            onCheckedChange={toggleAllCourses}
                                        />
                                        <Label
                                            htmlFor="select-all-courses"
                                            className="cursor-pointer text-sm"
                                        >
                                            Select All
                                        </Label>
                                    </div>
                                </div>

                                {/* Tag Selection */}
                                <div className="space-y-2">
                                    <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                                        Bulk Select by Tag
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <Badge
                                                key={tag.id}
                                                variant={
                                                    isTagSelected(tag)
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className="cursor-pointer px-3 py-1 text-xs transition-all hover:opacity-80"
                                                onClick={() => toggleTag(tag)}
                                            >
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="rounded-md border bg-muted/20 p-4">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {courses.map((course) => (
                                            <div
                                                key={course.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`course-${course.id}`}
                                                    checked={data.courses.includes(
                                                        course.id,
                                                    )}
                                                    onCheckedChange={() =>
                                                        toggleCourse(course.id)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`course-${course.id}`}
                                                    className="line-clamp-1 cursor-pointer text-sm font-normal"
                                                >
                                                    {course.title}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>

                                    {courses.length === 0 && (
                                        <p className="py-4 text-center text-sm text-muted-foreground">
                                            No courses available in the system.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-6 pb-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsSheetOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Saving...'
                                    : editingPosition
                                      ? 'Save Changes'
                                      : 'Create Position'}
                            </Button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>
        </AppLayout>
    );
}
