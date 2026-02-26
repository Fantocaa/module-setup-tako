import AppNavbar from '@/components/app-navbar';
import { CourseCard } from '@/components/course-card';
import { Footer } from '@/components/footer';
import { Pagination } from '@/components/pagination';
import { Container } from '@/components/ui/container';
import type { Course, Tag } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CoursesIndexProps {
    courses: {
        data: Course[];
        links: any[];
        meta: any;
    };
    tags: Tag[];
    filters: {
        tag?: string;
        search?: string;
    };
}

export default function CoursesIndex({
    courses,
    tags,
    filters,
}: CoursesIndexProps) {
    // const { auth } = usePage().props as any;
    const [selectedTag, setSelectedTag] = useState<string | null>(
        filters.tag || null,
    );
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    // Immediate navigation for tag switching
    const handleTagChange = (tag: string | null) => {
        setSelectedTag(tag);
        router.get(
            '/courses',
            {
                tag: tag || undefined,
                search: searchQuery || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    // Debounced search query
    useEffect(() => {
        if (searchQuery === filters.search) return;

        const delayDebounceFn = setTimeout(() => {
            router.get(
                '/courses',
                {
                    tag: selectedTag || undefined,
                    search: searchQuery || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-background text-foreground lg:bg-linear-to-b dark:lg:from-[#202020] dark:lg:to-black">
            <Head title="Series" />
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>
            <div className="border-b border-border/50 px-4 py-4 lg:px-0 lg:py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Series
                        </h1>
                        <p className="max-w-2xl text-base leading-relaxed text-muted-fg">
                            Pelajari topik-topik penting dalam pengembangan
                            aplikasi web dan jadilah developer handal di era
                            teknologi modern.
                        </p>
                    </div>

                    {/* Filter Tags */}
                    <div className="mt-8 scrollbar-hide flex flex-nowrap gap-x-6 overflow-x-auto pb-2 text-sm font-medium">
                        <button
                            className={`whitespace-nowrap transition-colors ${selectedTag === null ? 'text-foreground' : 'text-muted-fg hover:text-foreground'}`}
                            onClick={() => handleTagChange(null)}
                        >
                            Semua
                        </button>
                        {tags.map((tag) => (
                            <button
                                key={tag.id}
                                className={`whitespace-nowrap transition-colors ${
                                    selectedTag === tag.slug
                                        ? 'text-foreground'
                                        : 'text-muted-fg hover:text-foreground'
                                }`}
                                onClick={() => handleTagChange(tag.slug)}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${filters.tag || 'all'}-${filters.search || ''}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {/* Courses Grid */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {courses.data.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>

                        {courses.data.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-muted-fg">
                                    Tidak ada course yang ditemukan.
                                </p>
                            </div>
                        )}

                        <Pagination links={courses.links} className="mt-12" />
                    </motion.div>
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
}
