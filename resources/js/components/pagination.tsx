import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    className?: string;
}

export function Pagination({ links, className }: PaginationProps) {
    if (links.length <= 3) return null;

    const navigate = (url: string | null) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <div
            className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
        >
            {links.map((link, index) => {
                const label = link.label.toLowerCase();
                const isPrev = label.includes('prev');
                const isNext = label.includes('next');

                return (
                    <Button
                        key={index}
                        variant={link.active ? 'default' : 'outline'}
                        size={isPrev || isNext ? 'default' : 'icon'}
                        onClick={() => navigate(link.url)}
                        disabled={!link.url}
                        className={`min-w-[40px] rounded-xl border-border/50 text-sm font-bold transition-all active:scale-95 ${
                            link.active
                                ? 'bg-primary text-primary-fg shadow-lg shadow-primary/20'
                                : 'bg-background hover:bg-secondary'
                        }`}
                    >
                        {isPrev ? (
                            <div className="flex items-center gap-1 px-2">
                                <ChevronLeft className="h-4 w-4" />
                                <span className="hidden sm:inline">Prev</span>
                            </div>
                        ) : isNext ? (
                            <div className="flex items-center gap-1 px-2">
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        ) : (
                            <span
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        )}
                    </Button>
                );
            })}
        </div>
    );
}
