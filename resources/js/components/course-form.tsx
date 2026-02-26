import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface CourseFormProps {
    course?: any;
    tags: any[];
    submitLabel: string;
    action: string;
    method?: 'post' | 'put' | 'patch';
}

export default function CourseForm({
    course,
    tags,
    submitLabel,
    action,
    method = 'post',
}: CourseFormProps) {
    const { data, setData, post, put, processing, errors, transform } = useForm(
        {
            title: course?.title || '',
            slug: course?.slug || '',
            description: course?.description || '',
            thumbnail: course?.thumbnail || '',
            is_published: course?.is_published ?? true,
            selectedTags: course?.tags?.map((t: any) => t.id) || [],
        },
    );

    // Auto-generate slug from title
    useEffect(() => {
        if (!course && data.title && !data.slug) {
            const slug = data.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            setData('slug', slug);
        }
    }, [data.title]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Transform data to match backend expectation
        transform((data) => ({
            ...data,
            tags: data.selectedTags,
        }));

        const options = {
            onSuccess: () => {
                toast.success('Course saved successfully.');
            },
            onError: () => {
                toast.error('Something went wrong. Please check the form.');
            },
        };

        if (method === 'post') {
            post(action, options);
        } else {
            put(action, options);
        }
    };

    const toggleTag = (tagId: number) => {
        const current = [...data.selectedTags];
        const index = current.indexOf(tagId);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(tagId);
        }
        setData('selectedTags', current);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="e.g. Belajar Laravel Dasar"
                        required
                    />
                    {errors.title && (
                        <p className="text-sm text-destructive">
                            {errors.title}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Tell us about this course..."
                />
                {errors.description && (
                    <p className="text-sm text-destructive">
                        {errors.description}
                    </p>
                )}
            </div>
            <div className="space-y-4">
                <Label>Tags</Label>
                <div className="mt-1 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className={cn(
                                'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                                data.selectedTags.includes(tag.id)
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-transparent bg-muted text-muted-foreground hover:border-border',
                            )}
                        >
                            {tag.name}
                        </button>
                    ))}
                </div>
                {errors.selectedTags && (
                    <p className="text-sm text-destructive">
                        {errors.selectedTags}
                    </p>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="is_published"
                    checked={data.is_published}
                    onCheckedChange={(checked) =>
                        setData('is_published', checked === true)
                    }
                />
                <Label htmlFor="is_published" className="font-normal">
                    Publish this course immediately
                </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.history.back()}
                    disabled={processing}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
