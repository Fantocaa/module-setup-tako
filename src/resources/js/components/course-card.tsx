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
            <Card className="group flex h-full flex-col overflow-hidden border-none bg-[#1a1a1a] py-0 transition-all hover:bg-[#222222]">
                <CardHeader className="relative space-y-2 py-6 pl-8">
                    <CardTitle className="line-clamp-2 text-lg font-bold text-white group-hover:text-primary">
                        {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm text-white/50">
                        {course.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto px-8 text-xs font-medium text-white/40">
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
                                className="text-[10px] font-bold tracking-wider"
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
                </CardFooter>
            </Card>
        </Link>
    );
}
