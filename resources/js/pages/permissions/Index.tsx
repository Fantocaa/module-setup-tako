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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Plus, Save, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    permissions: {
        data: Permission[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    groups: string[];
    filters: {
        group?: string;
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Permission Management',
        href: '/permissions',
    },
];

export default function PermissionIndex({
    permissions,
    groups,
    filters,
}: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPermission, setEditingPermission] =
        useState<Permission | null>(null);

    const {
        data,
        setData,
        post,
        put,
        processing,
        errors,
        reset,
        clearErrors,
        transform,
    } = useForm({
        name: '',
        group: '',
        newGroup: '',
    });

    const handleDelete = (id: number) => {
        router.delete(`/permissions/${id}`, {
            onSuccess: () => toast.success('Permission deleted successfully'),
            onError: () => toast.error('Failed to delete permission'),
        });
    };

    const handleGroupChange = (value: string) => {
        const actualValue = value === '__ALL__' ? '' : value;
        router.get(
            '/permissions',
            { ...filters, group: actualValue },
            { preserveScroll: true },
        );
    };

    const handleSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.get(
                '/permissions',
                { ...filters, search },
                { preserveScroll: true },
            );
        }
    };

    const openCreateDialog = () => {
        setEditingPermission(null);
        reset();
        clearErrors();
        setIsDialogOpen(true);
    };

    const openEditDialog = (permission: Permission) => {
        setEditingPermission(permission);
        setData({
            name: permission.name,
            group: permission.group || '',
            newGroup: '',
        });
        clearErrors();
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            group:
                data.newGroup.trim() !== '' ? data.newGroup.trim() : data.group,
        }));

        if (editingPermission) {
            put(`/permissions/${editingPermission.id}`, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('Permission updated successfully');
                },
            });
        } else {
            post('/permissions', {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    toast.success('Permission created successfully');
                    reset();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permission Management" />
            <div className="flex-1 p-4 md:p-6">
                <Card>
                    <CardHeader className="flex flex-col gap-4 pb-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">
                                Permissions
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Manage system access permissions
                            </p>
                        </div>
                        <Button onClick={openCreateDialog}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Permission
                        </Button>
                    </CardHeader>

                    <Separator />

                    <CardContent className="space-y-6 pt-6">
                        {/* Filter */}
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <Input
                                type="text"
                                placeholder="Search permissions... (press Enter)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKey}
                            />
                            <Select
                                value={filters.group || '__ALL__'}
                                onValueChange={handleGroupChange}
                            >
                                <SelectTrigger className="md:w-64">
                                    <SelectValue placeholder="All Groups" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__ALL__">
                                        All Groups
                                    </SelectItem>
                                    {groups.map((group) => (
                                        <SelectItem key={group} value={group}>
                                            {group}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* List */}
                        <div className="space-y-3">
                            {permissions.data.length === 0 ? (
                                <p className="text-center text-muted-foreground">
                                    No data available.
                                </p>
                            ) : (
                                permissions.data.map((permission) => (
                                    <div
                                        key={permission.id}
                                        className="flex items-center justify-between rounded-md border bg-muted/50 px-4 py-3 transition hover:bg-muted/70"
                                    >
                                        <div className="text-sm font-medium text-foreground">
                                            {permission.name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    openEditDialog(permission)
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
                                                            Delete this
                                                            permission?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Permission{' '}
                                                            <strong>
                                                                {
                                                                    permission.name
                                                                }
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
                                                                    permission.id,
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
                        {permissions.links.length > 1 && (
                            <div className="flex flex-wrap justify-center gap-2 pt-6">
                                {permissions.links.map((link, i) => (
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
                            {editingPermission
                                ? 'Edit Permission'
                                : 'Add Permission'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingPermission
                                ? 'Edit permission details'
                                : 'Create a new permission'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Permission Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Permission Name</Label>
                            <Input
                                id="name"
                                placeholder="example: manage-users"
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

                        {/* Select Group */}
                        <div className="space-y-2">
                            <Label htmlFor="group">Select Group</Label>
                            <Select
                                value={data.group || ''}
                                onValueChange={(val) => setData('group', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select group..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {groups.map((group) => (
                                        <SelectItem key={group} value={group}>
                                            {group}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.group && (
                                <p className="text-sm text-red-500">
                                    {errors.group}
                                </p>
                            )}
                        </div>

                        {/* New Group */}
                        <div className="space-y-2">
                            <Label htmlFor="newGroup">
                                Or type a new group
                            </Label>
                            <Input
                                id="newGroup"
                                placeholder="example: Tender / Article / User"
                                value={data.newGroup}
                                onChange={(e) =>
                                    setData('newGroup', e.target.value)
                                }
                            />
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
                                    : editingPermission
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
