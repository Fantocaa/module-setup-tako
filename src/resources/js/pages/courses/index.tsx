import AppNavbar from '@/components/app-navbar';
import { CourseCard } from '@/components/course-card';
import { Container } from '@/components/ui/container';
import type { Course, Tag } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
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
        <div className="min-h-screen bg-gradient-to-b from-[#202020] to-black text-white">
            <Head title="Series" />
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>
            <div className="border-b border-white/5 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Series
                        </h1>
                        <p className="max-w-2xl text-base leading-relaxed text-white/50">
                            Pelajari topik-topik penting dalam pengembangan
                            aplikasi web dan jadilah developer handal di era
                            teknologi modern.
                        </p>
                    </div>

                    {/* Filter Tags */}
                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
                        <button
                            className={`transition-colors ${selectedTag === null ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
                            onClick={() => handleTagChange(null)}
                        >
                            Semua
                        </button>
                        {tags.map((tag) => (
                            <button
                                key={tag.id}
                                className={`transition-colors ${
                                    selectedTag === tag.slug
                                        ? 'text-white'
                                        : 'text-white/40 hover:text-white/60'
                                }`}
                                onClick={() => handleTagChange(tag.slug)}
                            >
                                {tag.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
                                <p className="text-white/40">
                                    Tidak ada course yang ditemukan.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {courses.links && courses.links.length > 3 && (
                            <div className="mt-12 flex justify-center gap-2">
                                {courses.links.map(
                                    (link: any, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (link.url) {
                                                    router.visit(link.url, {
                                                        preserveState: true,
                                                        preserveScroll: false,
                                                    });
                                                }
                                            }}
                                            disabled={!link.url}
                                            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-white text-black'
                                                    : link.url
                                                      ? 'bg-white/5 hover:bg-white/10'
                                                      : 'cursor-not-allowed opacity-30'
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ),
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
