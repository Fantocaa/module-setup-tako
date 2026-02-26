import { Badge } from '@/components/ui/badge';
import type { Course } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from './ui/card';

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    const formatDuration = (seconds: number | undefined) => {
        if (!seconds) return '0 menit';
        const minutes = Math.floor(seconds / 60);
        return `${minutes} menit`;
    };

    return (
        <Link href={`/courses/${course.slug}`}>
            <Card className="group relative flex h-full flex-col overflow-hidden border-none bg-card py-0 transition-all hover:bg-accent/50 dark:bg-[#1a1a1a] dark:hover:bg-[#222222]">
                <div className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-muted-foreground/20 transition-all duration-300 group-hover:h-16 group-hover:bg-primary" />
                <CardHeader className="relative space-y-2 py-6 pl-8">
                    <CardTitle className="line-clamp-2 text-lg font-bold text-card-foreground group-hover:text-primary">
                        {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                        {course.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto px-8 text-xs font-medium text-muted-foreground/80">
                    <div className="flex items-center gap-4">
                        <span>{formatDuration(course.total_duration)}</span>
                        <span>{course.lesson_count || 0} episode</span>
                    </div>
                </CardContent>
                <CardFooter className="px-8 pb-6">
                    <div className="flex flex-wrap gap-2">
                        {course.tags?.map((tag) => (
                            <Badge
                                key={tag.id}
                                className="border-none text-[10px] font-bold tracking-wider"
                                style={{
                                    color: tag.color || 'currentColor',
                                    backgroundColor: tag.color
                                        ? `color-mix(in srgb, ${tag.color}, transparent 85%)`
                                        : 'rgba(120,120,120,0.1)',
                                }}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
