import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import SortableLessonItem from '@/pages/courses/[slug]/lessons/SortableLessonItem';
import { Course, Lesson } from '@/types';
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Link, router } from '@inertiajs/react';
import { Clock, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    course: Course;
    lessons: Lesson[];
}

export default function LessonManager({
    course,
    lessons: initialLessons,
}: Props) {
    const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
    const [isSaving, setIsSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setLessons((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.id.toString() === active.id.toString(),
                );
                const newIndex = items.findIndex(
                    (item) => item.id.toString() === over?.id.toString(),
                );
                const newItems = arrayMove(items, oldIndex, newIndex);
                return newItems;
            });
        }
    };

    const handleSaveOrder = () => {
        setIsSaving(true);
        const payload = lessons.map((lesson, index) => ({
            id: lesson.id,
            order: index + 1,
        }));

        router.post(
            `/courses/${course.id}/lessons/reorder`,
            { lessons: payload },
            {
                onSuccess: () =>
                    toast.success('Lesson order updated successfully'),
                onError: () => toast.error('Failed to update lesson order'),
                onFinish: () => setIsSaving(false),
            },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this lesson?')) {
            router.delete(`/courses/${course.slug}/lessons/${id}`, {
                onSuccess: () => {
                    toast.success('Lesson deleted successfully');
                    setLessons(lessons.filter((l) => l.id !== id));
                },
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>Manage Lessons</CardTitle>
                        <CardDescription>
                            Organize lessons for "
                            <strong>{course.title}</strong>"
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleSaveOrder}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Order'}
                        </Button>
                        <Button asChild>
                            <Link
                                href={`/courses/${course.slug}/lessons/create`}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Lesson
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {lessons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                        <p>No lessons found.</p>
                        <Button variant="link" asChild className="mt-2">
                            <Link
                                href={`/courses/${course.slug}/lessons/create`}
                            >
                                Create your first lesson
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={lessons.map((l) => l.id.toString())}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {lessons.map((lesson) => (
                                    <SortableLessonItem
                                        key={lesson.id}
                                        id={lesson.id.toString()}
                                        isLocked={!lesson.is_preview}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <div className="font-medium">
                                                        {lesson.title}
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {lesson.duration}{' '}
                                                            min
                                                        </span>
                                                        <Badge
                                                            variant={
                                                                lesson.is_published
                                                                    ? 'default'
                                                                    : 'secondary'
                                                            }
                                                            className="h-5 px-1.5 text-[10px]"
                                                        >
                                                            {lesson.is_published
                                                                ? 'Published'
                                                                : 'Draft'}
                                                        </Badge>
                                                        {!lesson.is_preview && (
                                                            <Badge
                                                                variant="outline"
                                                                className="h-5 px-1.5 text-[10px]"
                                                            >
                                                                Locked
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/courses/${course.slug}/lessons/${lesson.id}/edit`}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() =>
                                                        handleDelete(lesson.id)
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </SortableLessonItem>
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </CardContent>
        </Card>
    );
}
