import AppNavbar from '@/components/app-navbar';
import { CourseCard } from '@/components/course-card';
import { Footer } from '@/components/footer';
import { Container } from '@/components/ui/container';
import { Head, Link } from '@inertiajs/react';
import { Clock, PlayCircle } from 'lucide-react';

interface WatchLaterIndexProps {
    courses: {
        data: any[];
        links: any[];
        meta: any;
    };
}

export default function WatchLaterIndex({ courses }: WatchLaterIndexProps) {
    return (
        <div className="min-h-screen bg-background text-foreground lg:bg-linear-to-b dark:lg:from-[#202020] dark:lg:to-[#0a0a0a]">
            <Head title="Tonton Nanti" />
            <Container className="py-6 sm:py-12">
                <AppNavbar />
            </Container>

            <div className="border-b border-border/50 px-4 py-8 lg:px-0 lg:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-muted-fg">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Tonton Nanti
                            </h1>
                            <p className="mt-1 text-base text-muted-fg">
                                Daftar course yang ingin Anda pelajari nanti.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
                {courses.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.data.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary text-muted-fg/20">
                            <PlayCircle className="h-10 w-10" />
                        </div>
                        <h2 className="mt-6 text-xl font-bold">
                            Belum ada daftar tonton nanti
                        </h2>
                        <p className="mt-2 max-w-xs text-muted-fg">
                            Simpan course yang menarik minat Anda untuk ditonton
                            di lain waktu.
                        </p>
                        <Link
                            href="/courses"
                            className="mt-8 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-primary-fg transition-all hover:scale-105 active:scale-95"
                        >
                            Jelajahi Course
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
