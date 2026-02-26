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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColorArea } from '@/components/ui/color-area';
import { ColorField } from '@/components/ui/color-field';
import { ColorPicker } from '@/components/ui/color-picker';
import { ColorSlider, ColorSliderTrack } from '@/components/ui/color-slider';
import { ColorThumb } from '@/components/ui/color-thumb';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/intent-input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, type Tag } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { parseColor } from '@react-stately/color';
import { Edit, Plus, Save, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    tags: {
        data: Tag[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tag Management',
        href: '/tags',
    },
];

function safeParseColor(value: string | undefined) {
    if (!value) return parseColor('#000000').toFormat('hsb');
    try {
        return parseColor(value).toFormat('hsb');
    } catch {
        return parseColor('#000000').toFormat('hsb');
    }
}

export default function TagIndex({ tags, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [color, setColor] = useState(parseColor('#0d6efd'));

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            color: '#000000',
        });

    const handleDelete = (id: number) => {
        router.delete(`/tags/${id}`, {
            onSuccess: () => toast.success('Tag deleted successfully'),
            onError: () => toast.error('Failed to delete tag'),
        });
    };

    const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(
                '/tags',
                { ...filters, search },
                { preserveScroll: true },
            );
        }
    };

    const openCreateDialog = () => {
        setEditingTag(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (tag: Tag) => {
        setEditingTag(tag);
        setData({
            name: tag.name,
            color: tag.color || '#000000',
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingTag) {
            put(`/tags/${editingTag.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('Tag updated successfully');
                },
            });
        } else {
            post('/tags', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('Tag created successfully');
                    reset();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tag Management" />
            <div className="flex-1 p-4 md:p-6">
                <Card>
                    <CardHeader className="flex flex-col gap-4 pb-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Tags
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Manage content tags
                            </p>
                        </div>
                        <Button onClick={openCreateDialog}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Tag
                        </Button>
                    </CardHeader>

                    <Separator />

                    <CardContent className="space-y-6 pt-6">
                        {/* Filter */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <Input
                                type="text"
                                placeholder="Search tags... (press Enter)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKey}
                                className="max-w-sm"
                            />
                        </div>

                        {/* List */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {tags.data.length === 0 ? (
                                <p className="text-center text-muted-foreground">
                                    No tags found.
                                </p>
                            ) : (
                                tags.data.map((tag) => (
                                    <div
                                        key={tag.id}
                                        className="flex items-center justify-between rounded-md border bg-muted/50 px-4 py-3 transition hover:bg-muted/70"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-6 w-6 rounded-full border shadow-sm"
                                                style={{
                                                    backgroundColor:
                                                        tag.color || '#000000',
                                                }}
                                            />
                                            <div className="text-sm font-medium text-foreground">
                                                {tag.name}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    openEditDialog(tag)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Delete this tag?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tag{' '}
                                                            <strong>
                                                                {tag.name}
                                                            </strong>{' '}
                                                            will be permanently
                                                            deleted.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-destructive text-white hover:bg-destructive/90"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    tag.id,
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {tags.links.length > 3 && (
                            <div className="flex flex-wrap justify-center gap-2 pt-6">
                                {tags.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        disabled={!link.url}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            router.visit(link.url || '', {
                                                preserveScroll: true,
                                            })
                                        }
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingTag ? 'Edit Tag' : 'Add Tag'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingTag
                                ? 'Edit tag details'
                                : 'Create a new tag'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Tag Name</Label>
                            <Input
                                id="name"
                                placeholder="example: React"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Preview</Label>
                            <div className="flex items-center gap-2">
                                <span
                                    className="rounded-xl px-2 py-1 text-sm font-medium"
                                    style={{
                                        borderColor: data.color || '#000000',
                                        color: data.color || '#000000',
                                        backgroundColor: `color-mix(in srgb, ${data.color || '#000000'}, transparent 80%)`,
                                    }}
                                >
                                    {data.name || 'Preview Tag'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Color</Label>
                            <div className="flex flex-col gap-2">
                                <ColorPicker
                                    value={safeParseColor(data.color)}
                                    onChange={(c) =>
                                        setData('color', c.toString('hex'))
                                    }
                                >
                                    <div className="space-y-2 rounded-md border p-3">
                                        <ColorArea
                                            colorSpace="hsb"
                                            xChannel="saturation"
                                            yChannel="brightness"
                                            className="mb-4 w-full"
                                        />

                                        <ColorSlider
                                            colorSpace="hsb"
                                            channel="hue"
                                        >
                                            <ColorSliderTrack>
                                                <ColorThumb />
                                            </ColorSliderTrack>
                                        </ColorSlider>

                                        <ColorField aria-label="Color">
                                            <Input />
                                        </ColorField>
                                    </div>
                                </ColorPicker>
                            </div>
                            {errors.color && (
                                <p className="text-sm text-red-500">
                                    {errors.color}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                {processing
                                    ? 'Saving...'
                                    : editingTag
                                      ? 'Save Changes'
                                      : 'Add'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
